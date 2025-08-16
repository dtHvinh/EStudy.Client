import api from "@/components/utils/requestUtils";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export type MessageType = {
  id?: string;
  message: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
};

export enum MessageSymbol {
  VOICE_STREAM_END = "^#^",
}

export default function useStreamingVoiceChat(
  {
    conversationId,
    initialMessages,
  }: {
    initialMessages: MessageType[];
    conversationId?: string;
  } = {
    initialMessages: [],
    conversationId: "",
  },
) {
  const webSocket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const webSocketUrl = "ws://localhost:7186/ws/chat" + `/${conversationId}`;
  const [messages, setMessages] = useState<MessageType[]>([]);

  const audioChunks = useRef<Int16Array[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const currentAudioBuffer = useRef<AudioBuffer | null>(null);
  const currentSource = useRef<AudioBufferSourceNode | null>(null);
  const pendingChunks = useRef<number>(0);
  const streamEnded = useRef<boolean>(false);

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
  }, []);

  const initializeAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }
  };

  const initializeWebSocket = () => {
    webSocket.current = new WebSocket(webSocketUrl);

    webSocket.current.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connection opened");
    };

    webSocket.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    webSocket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    webSocket.current.onmessage = async (event) => {
      if (typeof event.data === "string") {
        if (event.data === MessageSymbol.VOICE_STREAM_END) {
          console.log("Voice stream ended, checking for pending chunks...");
          streamEnded.current = true;

          // Check if there are pending chunks or if we can play immediately
          if (pendingChunks.current === 0) {
            await playAudio();
          } else {
          }
          return;
        }

        streamEnded.current = false;
        pendingChunks.current = 0;
        stopAudio();
        setIsProcessing(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            message: event.data,
            timestamp: new Date(),
          },
        ]);
        setIsProcessing(false);
      } else if (
        event.data instanceof ArrayBuffer ||
        event.data instanceof Blob
      ) {
        console.log("Received audio chunk");
        pendingChunks.current++;
        await handleSingleAudioStreamData(event.data);
      }
    };
  };

  const initializeAudioBuffer = (data: Int16Array[]) => {
    if (!audioContext.current) return;

    const totalSamples = data.reduce((sum, chunk) => sum + chunk.length, 0);

    // Create a single Int16Array with all samples
    const combinedSamples = new Int16Array(totalSamples);
    let offset = 0;

    for (const chunk of data) {
      combinedSamples.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert 16-bit PCM to Float32Array
    const floatSamples = new Float32Array(combinedSamples.length);
    for (let i = 0; i < combinedSamples.length; i++) {
      floatSamples[i] = combinedSamples[i] / 32768.0;
    }

    // Create AudioBuffer (assuming mono 22050 Hz - adjust if needed)
    const sampleRate = 22050; // Default for Piper TTS
    const channels = 1;

    currentAudioBuffer.current = audioContext.current.createBuffer(
      channels,
      floatSamples.length,
      sampleRate,
    );

    currentAudioBuffer.current.copyToChannel(floatSamples, 0);
  };

  const playAudio = useCallback(async () => {
    console.log(
      "Attempting to play audio, chunks:",
      audioChunks.current.length,
    );
    if (audioChunks.current.length === 0) {
      console.log("No audio chunks to play");
      return;
    }

    if (!currentAudioBuffer.current) {
      console.log("Creating audio buffer...");
      initializeAudioBuffer(audioChunks.current);
    }

    if (!currentAudioBuffer.current || !audioContext.current) {
      console.log("Audio buffer or context not available");
      return;
    }

    try {
      // Stop any currently playing audio
      if (currentSource.current) {
        currentSource.current.stop();
        currentSource.current = null;
      }

      currentSource.current = audioContext.current.createBufferSource();
      currentSource.current.buffer = currentAudioBuffer.current;
      currentSource.current.connect(audioContext.current.destination);
      currentSource.current.start();

      console.log("Audio playback started successfully");

      // Clear chunks and buffer after playback starts
      audioChunks.current = [];
      currentAudioBuffer.current = null;
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (currentSource.current) {
      try {
        currentSource.current.stop();
      } catch (err) {
        console.log("Audio already stopped or not playing");
      }
      currentSource.current = null;
    }
    // Clear audio data and reset state
    audioChunks.current = [];
    currentAudioBuffer.current = null;
    pendingChunks.current = 0;
    streamEnded.current = false;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (
        !webSocket.current ||
        webSocket.current.readyState !== WebSocket.OPEN
      ) {
        console.error("WebSocket is not open");
        initializeWebSocket();
        return;
      }

      // Stop any current audio and clear buffers
      stopAudio();

      setIsProcessing(true);

      await api.post(`/api/ai/conversations/${conversationId}/messages`, {
        conversationId,
        message: content,
        isUserMessage: true,
      });

      // Add user message to local state
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          message: content,
          timestamp: new Date(),
        },
      ]);

      webSocket.current.send(
        JSON.stringify({
          messages: [
            ...initialMessages,
            {
              role: "user",
              content,
            },
          ],
        }),
      );
    },
    [stopAudio],
  );

  useEffect(() => {
    initializeAudioContext();
    initializeWebSocket();

    return () => {
      webSocket.current?.close();
    };
  }, []);

  const handleSingleAudioStreamData = async (data: ArrayBuffer | Blob) => {
    if (!audioContext.current) {
      console.log("Audio context not available");
      pendingChunks.current--;
      return;
    }

    // Resume audio context if suspended (important for user interaction requirement)
    if (audioContext.current.state === "suspended") {
      try {
        await audioContext.current.resume();
        console.log("Audio context resumed");
      } catch (err) {
        console.error("Failed to resume audio context:", err);
      }
    }

    try {
      let arrayBuffer: ArrayBuffer;

      if (data instanceof Blob) {
        arrayBuffer = await data.arrayBuffer();
      } else {
        arrayBuffer = data;
      }

      const int16Array = new Int16Array(arrayBuffer);
      audioChunks.current.push(int16Array);
      console.log(
        `Added audio chunk, total chunks: ${audioChunks.current.length}, chunk size: ${int16Array.length}`,
      );

      // Decrement pending chunks counter
      pendingChunks.current--;

      // If stream has ended and no more chunks are pending, play audio
      if (streamEnded.current && pendingChunks.current === 0) {
        console.log("All chunks processed, playing audio now...");
        await playAudio();
      }
    } catch (error) {
      console.error("Error handling audio stream data:", error);
      pendingChunks.current--;
    }
  };

  return {
    messages,
    isConnected,
    isProcessing,
    sendMessage,
    playAudio,
    stopAudio,
  };
}
