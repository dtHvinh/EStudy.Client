"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconSend2 } from "@tabler/icons-react";
import { MicIcon, StopCircleIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
}: ChatInputProps) {
  const [rows, setRows] = useState(1);

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

    // Auto-resize textarea
    const lineHeight = 24;
    const maxRows = 5;
    const textareaLineHeight = e.target.scrollHeight / lineHeight;
    const newRows = Math.min(Math.max(textareaLineHeight, 1), maxRows);
    setRows(newRows);
  };

  return (
    <div className="bg-background border-t p-4">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-background flex items-center gap-2 rounded-xl p-3">
            <Textarea
              spellCheck="false"
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message ChatGPT..."
              className="min-h-[24px] resize-none rounded-full bg-transparent px-5 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={rows}
              disabled={isLoading}
            />

            <div className="flex flex-shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MicIcon className="h-4 w-4" />
              </Button>

              {isLoading ? (
                <Button
                  type="button"
                  onClick={stop}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <StopCircleIcon className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  className="h-8 w-8 p-0"
                >
                  <IconSend2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
