"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";
import { Message } from "./message";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useStreamingChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 overflow-auto" ref={scrollAreaRef}>
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-semibold">
                  How can I help you today?
                </h2>
                <p className="text-muted-foreground">
                  Start a conversation by typing a message below.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <Message
                  isLoading={isLoading}
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
      />
    </div>
  );
}
