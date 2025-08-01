import { useCallback, useEffect, useRef, useState } from "react";

export type MessageType = {
  content: string;
  role: "user" | "assistant" | "system";
};

export enum MessageSymbol {
  VOICE_STREAM_END = "^#^",
}

export default function useStreamingVoiceChat() {
  const webSocket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState<MessageType[]>([]);

  const audioChunks = useRef<Int16Array[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const currentAudioBuffer = useRef<AudioBuffer | null>(null);
  const currentSource = useRef<AudioBufferSourceNode | null>(null);

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
    webSocket.current = new WebSocket("ws://localhost:7186/ws/chat");

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

    webSocket.current.onmessage = (event) => {
      if (typeof event.data === "string") {
        if (event.data === MessageSymbol.VOICE_STREAM_END) {
          playAudio();
          return;
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: event.data,
            timestamp: new Date(),
          },
        ]);
      } else if (event.data instanceof ArrayBuffer) {
        handleSingleAudioStreamData(event.data);
      }
    };
  };

  const initializeAudioBuffer = (data: Int16Array[]) => {
    const totalBytes = data.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedData = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of data) {
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
  };

  const playAudio = useCallback(async () => {
    if (!currentAudioBuffer.current || !audioContext.current) {
      initializeAudioBuffer(audioChunks.current);
    }
    try {
      currentSource.current = audioContext.current!.createBufferSource();
      currentSource.current.buffer = currentAudioBuffer.current;
      currentSource.current.connect(audioContext.current!.destination);
      currentSource.current.start();
      audioChunks.current = []; // Clear chunks after playback
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

  const sendMessage = useCallback((messages: MessageType) => {
    if (!webSocket.current || webSocket.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open");
    }

    webSocket.current?.send(
      JSON.stringify({
        messages: messages,
      }),
    );
  }, []);

  useEffect(() => {
    initializeAudioContext();
    initializeWebSocket();

    return () => {
      webSocket.current?.close();
    };
  }, []);

  const handleSingleAudioStreamData = (data: ArrayBuffer) => {
    if (!audioContext.current) return;

    if (audioContext.current.state === "suspended") {
      audioContext.current.resume();
    }

    const int16Array = new Int16Array(data);
    audioChunks.current.push(int16Array);
  };

  return {
    messages,
    isConnected,
    sendMessage,
    playAudio,
    stopAudio,
  };
}
