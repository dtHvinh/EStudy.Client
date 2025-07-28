"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Message as MessageType } from "@/hooks/use-streaming-chat";
import { cn } from "@/lib/utils";
import {
  BotIcon,
  CopyIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import HTMLContent from "../content/html-content";

interface MessageProps {
  message: MessageType;
  isLast?: boolean;
  isLoading?: boolean;
}

export function Message({ isLoading, message, isLast }: MessageProps) {
  const isUser = message.role === "user";

  const copyToClipboard = async () => {
    try {
      toast.message("Copied to clipboard", {
        description: "The message content has been copied to your clipboard.",
        duration: 2000,
        position: "bottom-right",
      });
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`group relative flex gap-4 px-4 py-6`}>
      <Avatar
        className={cn(
          "h-8 w-8 flex-shrink-0 invert dark:invert-0",
          isLoading && !isUser && "motion-safe:animate-ping",
        )}
      >
        <AvatarFallback>
          {isUser ? (
            <UserIcon className="h-4 w-4" />
          ) : (
            <BotIcon className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 overflow-hidden">
        <HTMLContent content={message.content} />

        {!isUser && message.content && (
          <div className="absolute bottom-0 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={copyToClipboard}
            >
              <CopyIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsUpIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsDownIcon className="h-3 w-3" />
            </Button>
            {isLast && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RefreshCwIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
