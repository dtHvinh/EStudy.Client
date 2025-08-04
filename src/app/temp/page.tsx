"use client";
import useStreamingVoiceChat from "@/hooks/use-streaming-voice-chat";
import { useState } from "react";

export default function TempPage() {
  const [inputMessage, setInputMessage] = useState("");
  const { messages, isConnected, isProcessing, sendMessage } =
    useStreamingVoiceChat();

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isProcessing) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
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
                msg.role === "user"
                  ? "#e3f2fd"
                  : msg.role === "assistant"
                    ? "#f3e5f5"
                    : "#fff3e0",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}
            >
              {msg.role.toUpperCase()} - {msg.timestamp.toLocaleTimeString()}
            </div>
            <div>{msg.message}</div>
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
          onClick={handleSendMessage}
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
