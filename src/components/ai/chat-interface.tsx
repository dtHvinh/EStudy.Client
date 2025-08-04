"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useConversationDetails from "@/hooks/use-conversation-details";
import useConversationMessage from "@/hooks/use-conversation-message";
import useStreamingVoiceChat from "@/hooks/use-streaming-voice-chat";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import NavigateBack from "../navigate-back";
import { ChatInput } from "./chat-input";
import { InitWelcomeMessage } from "./init-welcome-message";
import { Message } from "./message";

export function ChatInterface({ conversationId }: { conversationId: string }) {
  const { messages: initialMessages, scrollNext } =
    useConversationMessage(conversationId);
  const { details } = useConversationDetails(conversationId);
  const { messages, sendMessage, isProcessing } = useStreamingVoiceChat({
    conversationId,
    initialMessages,
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        scrollNext();
      }
    },
  });

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [messagesEndRef]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }, [messages]);

  return (
    <div className="bg-background flex h-screen min-h-0 flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex-shrink-0 border-b p-4 backdrop-blur"
      >
        <NavigateBack fallbackUrl="/ai" />
        <div className="mx-auto max-w-4xl">
          <h1 className="text-xl font-semibold">
            {details?.name || "Untitled Conversation"}
          </h1>
          <p className="text-muted-foreground text-sm">Transcript</p>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="mx-auto max-w-4xl p-4">
            <AnimatePresence>
              {messages.length === 0 && initialMessages.length === 0 ? (
                <InitWelcomeMessage />
              ) : (
                <>
                  <div ref={ref} />
                  {initialMessages.map((message, index) => (
                    <Message
                      isLoading={isProcessing}
                      key={index}
                      message={message}
                      isLast={index === messages.length - 1}
                    />
                  ))}
                  {messages.map((message, index) => (
                    <Message
                      isLoading={isProcessing}
                      key={index}
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
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput onVoiceSubmit={sendMessage} isLoading={isProcessing} />
      </div>
    </div>
  );
}
