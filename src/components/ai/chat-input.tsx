"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconSend2 } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { StopCircleIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { VoiceInput } from "./voice-input";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  setInput: (value: string) => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  setInput,
}: ChatInputProps) {
  const [rows, setRows] = useState(1);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);

    const lineHeight = 24;
    const maxRows = 5;
    const textareaLineHeight = e.target.scrollHeight / lineHeight;
    const newRows = Math.min(Math.max(textareaLineHeight, 1), maxRows);
    setRows(newRows);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
  };

  const handleVoiceSubmit = () => {
    if (input.trim() && !isLoading) {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(syntheticEvent);
    }
  };

  useEffect(() => {
    // Auto-adjust textarea height when input changes
    const lineHeight = 24;
    const maxRows = 5;
    const lines = input.split("\n").length;
    const newRows = Math.min(Math.max(lines, 1), maxRows);
    setRows(newRows);
  }, [input]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-background border-t p-4"
    >
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-background focus-within:ring-primary/20 flex items-center gap-2 rounded-xl border p-3 shadow-sm focus-within:ring-2"
          >
            {!isVoiceMode && (
              <Textarea
                spellCheck="false"
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message or use voice input..."
                className="min-h-[24px] resize-none rounded-full border-0 bg-transparent px-5 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                rows={rows}
                disabled={isLoading}
              />
            )}

            {isVoiceMode && (
              <div className="text-muted-foreground flex-1 px-5 py-3 text-sm">
                {input || "Click the microphone to start speaking..."}
              </div>
            )}

            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                type="button"
                variant={isVoiceMode ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                disabled={isLoading}
              >
                {isVoiceMode ? "Type" : "Voice"}
              </Button>

              {isVoiceMode && (
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  onSubmit={handleVoiceSubmit}
                  isLoading={isLoading}
                />
              )}

              {isLoading ? (
                <Button
                  type="button"
                  onClick={stop}
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                >
                  <StopCircleIcon className="h-4 w-4" />
                </Button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    className="h-8 w-8 p-0"
                  >
                    <IconSend2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </form>

        {isVoiceMode && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground mt-2 text-center text-xs"
          >
            Switch to voice mode and click the microphone to start speaking
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
