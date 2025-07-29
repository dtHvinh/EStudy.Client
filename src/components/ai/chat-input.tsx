"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { VoiceInput } from "./voice-input";

interface ChatInputProps {
  onVoiceSubmit: (transcript: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onVoiceSubmit, isLoading }: ChatInputProps) {
  const [currentTranscript, setCurrentTranscript] = useState("");

  const handleTranscriptChange = (transcript: string) => {
    setCurrentTranscript(transcript);
  };

  const handleVoiceSubmit = (transcript: string) => {
    onVoiceSubmit(transcript);
    setCurrentTranscript(""); // Clear the transcript after sending
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background border-t p-6"
    >
      <div className="mx-auto max-w-4xl">
        {/* Current transcript display */}
        {currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/50 mb-6 rounded-lg border p-4"
          >
            <p className="text-muted-foreground mb-1 text-sm">
              Current message:
            </p>
            <p className="text-sm">{currentTranscript}</p>
          </motion.div>
        )}

        <VoiceInput
          onSubmit={handleVoiceSubmit}
          isLoading={isLoading}
          currentTranscript={currentTranscript}
          onTranscriptChange={handleTranscriptChange}
        />
      </div>
    </motion.div>
  );
}
