"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";
import { InitWelcomeMessage } from "./init-welcome-message";
import { Message } from "./message";

export function ChatInterface() {
  const { messages, handleVoiceSubmit2, isLoading } = useStreamingChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-background flex h-screen flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b p-4 backdrop-blur"
      >
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-semibold">Voice Chat Assistant</h1>
          <p className="text-muted-foreground text-sm">Transcript</p>
        </div>
      </motion.div>

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-auto" ref={scrollAreaRef}>
        <div className="mx-auto max-w-4xl">
          <AnimatePresence>
            {messages.length === 0 ? (
              <InitWelcomeMessage />
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
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onVoiceSubmit={handleVoiceSubmit2} isLoading={isLoading} />
    </div>
  );
}
