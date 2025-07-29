"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ChatInput } from "./chat-input";
import { Message } from "./message";

export function ChatInterface() {
  const { messages, handleVoiceSubmit, isLoading, stop } = useStreamingChat();
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full items-center justify-center p-8"
              >
                <div className="space-y-4 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="border-primary h-8 w-8 rounded-full border-2 border-t-transparent"
                    />
                  </motion.div>
                  <h2 className="text-2xl font-semibold">
                    How can I help you today?
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Start a conversation by clicking the microphone button
                    below.
                  </p>
                </div>
              </motion.div>
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
      <ChatInput onVoiceSubmit={handleVoiceSubmit} isLoading={isLoading} />
    </div>
  );
}
