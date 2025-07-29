"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface MessageSendingIndicatorProps {
  isVisible: boolean;
  message: string;
}

export function MessageSendingIndicator({
  isVisible,
  message,
}: MessageSendingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="bg-primary/10 border-primary/20 mx-4 mb-4 flex items-center gap-3 rounded-lg border p-4"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="flex-shrink-0"
      >
        <Send className="text-primary h-4 w-4" />
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="text-primary text-sm font-medium">Sending message...</p>
        <p className="text-muted-foreground truncate text-xs">{message}</p>
      </div>
    </motion.div>
  );
}
