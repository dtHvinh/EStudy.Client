"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  type: "user" | "assistant" | "status" | "error";
  content: string;
  timestamp: Date;
}

export default function TempPage() {
  const [ws, setWS] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:7186/ws/chat");
    setWS(socket);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      setIsConnected(true);
    };
    socket.onmessage = (event) => {
      if (typeof event.data === "string") {
        if (event.data == "^^^" && currentSource.current) {
          currentSource.current.start();
          return;
        }
        // Handle text response
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: event.data,
            timestamp: new Date(),
          },
        ]);
        setIsProcessing(false);
      } else if (
        event.data instanceof ArrayBuffer ||
        event.data instanceof Blob
      ) {
        // Handle binary audio data
        handleAudioData(event.data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      setIsProcessing(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      setIsProcessing(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleAudioData = useCallback(async (data: ArrayBuffer | Blob) => {
    if (!audioContext.current) return;

    try {
      let arrayBuffer: ArrayBuffer;

      if (data instanceof Blob) {
        arrayBuffer = await data.arrayBuffer();
      } else {
        arrayBuffer = data;
      }

      // Convert ArrayBuffer to Int16Array (assuming 16-bit PCM)
      const int16Array = new Int16Array(arrayBuffer);

      // Create audio buffer (assuming mono, 22050 Hz - adjust based on your TTS output)
      const audioBuffer = audioContext.current.createBuffer(
        1,
        int16Array.length,
        22050,
      );
      const channelData = audioBuffer.getChannelData(0);

      // Convert 16-bit PCM to float32 (-1 to 1 range)
      for (let i = 0; i < int16Array.length; i++) {
        channelData[i] = int16Array[i] / 32768;
      }

      // Play the audio
      currentSource.current = audioContext.current.createBufferSource();
      currentSource.current.buffer = audioBuffer;
      currentSource.current.connect(audioContext.current.destination);
      currentSource.current.start();

      console.log("Audio playback started from binary data");
    } catch (err) {
      console.error("Audio playback error:", err);
    }
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

  const sendMessage = () => {
    if (ws && inputMessage.trim() && !isProcessing) {
      setIsProcessing(true);

      // Add user message to chat
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          content: inputMessage,
          timestamp: new Date(),
        },
      ]);

      ws.send(
        JSON.stringify({
          messages: [
            {
              role: "user",
              content: inputMessage,
            },
          ],
        }),
      );
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>AI Chat with Voice</h1>
      <div style={{ marginBottom: "10px" }}>
        Status:{" "}
        <span style={{ color: isConnected ? "green" : "red" }}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
        {isProcessing && (
          <span style={{ marginLeft: "10px", color: "orange" }}>
            Processing...
          </span>
        )}
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "8px",
              borderRadius: "4px",
              backgroundColor:
                msg.type === "user"
                  ? "#e3f2fd"
                  : msg.type === "assistant"
                    ? "#f3e5f5"
                    : msg.type === "error"
                      ? "#ffebee"
                      : "#fff3e0",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
            >
              {msg.type.toUpperCase()} - {msg.timestamp.toLocaleTimeString()}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected || isProcessing}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || isProcessing || !inputMessage.trim()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !isConnected || isProcessing ? "not-allowed" : "pointer",
            opacity: !isConnected || isProcessing ? 0.6 : 1,
          }}
        >
          {isProcessing ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
