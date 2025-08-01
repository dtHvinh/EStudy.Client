"use client";

import { getAccessToken } from "@/components/utils/authUtils";
import { AI_URL, API_BASE_URL } from "@/components/utils/requestUtils";
import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sender?: string;
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export function useStreamingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const audioContext = useRef<AudioContext | null>(null);
  const currentAudioBuffer = useRef<AudioBuffer | null>(null);
  const currentSource = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
  }, []);

  const processAudioStream = useCallback(async (response: Response) => {
    const reader = response.body!.getReader();
    const audioChunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      audioChunks.push(value);
    }

    // Combine all chunks
    const totalBytes = audioChunks.reduce(
      (sum, chunk) => sum + chunk.length,
      0,
    );
    const combinedData = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of audioChunks) {
      combinedData.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert PCM to Float32Array (assuming 16-bit mono at 22050 Hz)
    const samples = new Int16Array(combinedData.buffer);
    const floatSamples = new Float32Array(samples.length);

    for (let i = 0; i < samples.length; i++) {
      floatSamples[i] = samples[i] / 32768.0;
    }

    // Create AudioBuffer (assuming mono 22050 Hz - adjust if needed)
    const sampleRate = 22050; // Default for Piper TTS
    const channels = 1;

    currentAudioBuffer.current = audioContext.current!.createBuffer(
      channels,
      floatSamples.length,
      sampleRate,
    );

    currentAudioBuffer.current.copyToChannel(floatSamples, 0);
  }, []);

  const playAudio = useCallback(async () => {
    if (!currentAudioBuffer.current || !audioContext.current) return;
    try {
      currentSource.current = audioContext.current.createBufferSource();
      currentSource.current.buffer = currentAudioBuffer.current;
      currentSource.current.connect(audioContext.current.destination);
      currentSource.current.start();
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (currentSource.current) {
      currentSource.current.stop();
      currentSource.current = null;
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const setInputDirectly = useCallback((value: string) => {
    setInput(value);
  }, []);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
        sender: "You",
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        sender: "Assistant",
      };

      setMessages([...newMessages, assistantMessage]);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch(`${API_BASE_URL}/api/ai/text-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ messages: newMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const content = line.slice(6);

                // Skip empty lines
                if (!content) continue;

                console.log("About to push to TTS:", content);

                assistantContent += content;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: assistantContent }
                      : msg,
                  ),
                );
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError);
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Chat error:", error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: "Sorry, I encountered an error. Please try again.",
                  }
                : msg,
            ),
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, messages, isLoading],
  );

  const handleVoiceSubmit = useCallback(
    async (voiceInput: string) => {
      if (!voiceInput.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: voiceInput.trim(),
        timestamp: new Date(),
        sender: "You",
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        sender: "Assistant",
      };

      setMessages([...newMessages, assistantMessage]);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch(`${API_BASE_URL}/api/ai/text-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ messages: newMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const content = line.slice(6);
                if (!content) continue;

                assistantContent += content;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: assistantContent }
                      : msg,
                  ),
                );
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError);
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Chat error:", error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? {
                    ...msg,
                    content: "Sorry, I encountered an error. Please try again.",
                  }
                : msg,
            ),
          );
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading],
  );

  const handleVoiceSubmit2 = async (voiceInput: string) => {
    if (!voiceInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: voiceInput.trim(),
      timestamp: new Date(),
      sender: "You",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Voice",
      timestamp: new Date(),
      sender: "Assistant",
    };

    setMessages([...newMessages, assistantMessage]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${AI_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await processAudioStream(response);
      await playAudio();
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Chat error:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                }
              : msg,
          ),
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const setMessagesDirectly = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleVoiceSubmit,
    isLoading,
    stop,
    setMessages: setMessagesDirectly,
    setInput: setInputDirectly,
    playAudio,
    stopAudio,
    processAudioStream,
    handleVoiceSubmit2,
  };
}
