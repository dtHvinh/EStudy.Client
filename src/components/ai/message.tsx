"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageType } from "@/hooks/use-streaming-voice-chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import HTMLContent from "../content/html-content";

interface MessageProps {
  message: MessageType;
  isLast?: boolean;
  isLoading?: boolean;
}

export function Message({ message, isLast, isLoading }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className={cn(
        "flex w-full gap-3 p-4 transition-colors",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-medium",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1 sm:max-w-[70%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className={cn(
            "rounded-2xl px-4 py-2 text-sm leading-relaxed break-words",
            isUser ? "bg-muted rounded-br-md" : "bg-muted rounded-bl-md",
          )}
        >
          {message.message.length > 0 && (
            <HTMLContent content={message.message}></HTMLContent>
          )}
          {isLast && isLoading && message.role === "assistant" && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="ml-1"
            >
              ●
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
