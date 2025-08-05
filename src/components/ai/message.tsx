"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { MessageType } from "@/hooks/use-streaming-voice-chat";
import { useSentenceFeedback } from "@/hooks/useSentenceFeedback";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bot,
  CheckCircle,
  Loader2,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import HTMLContent from "../content/html-content";
import MessageTranslationButton from "./message-translation-button";
import { SentenceDiff } from "./sentence-diff";

interface MessageProps {
  message: MessageType;
  isLast?: boolean;
  isLoading?: boolean;
  context?: string;
}

export function Message({ message, isLast, isLoading, context }: MessageProps) {
  const isUser = message.role === "user";
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // Only fetch feedback for user messages when dialog is opened
  const {
    feedback,
    isLoading: feedbackLoading,
    refresh,
  } = useSentenceFeedback(
    isUser && feedbackDialogOpen ? message.message : undefined,
  );

  const handleFeedbackClick = () => {
    setFeedbackDialogOpen(true);
    if (!feedback && !feedbackLoading) {
      refresh();
    }
  };

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
      {/* Avatar Section */}
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

      {/* Message Content Section */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 sm:max-w-[70%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        {/* Message Bubble */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className={cn(
            "rounded-2xl px-4 py-2 text-sm leading-relaxed break-words",
            isUser ? "bg-accent rounded-br-md" : "bg-muted rounded-bl-md",
          )}
        >
          {message.message.length > 0 && (
            <HTMLContent content={message.message} className="text-sm" />
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
        {!isUser && (
          <MessageTranslationButton text={message.message} context={context} />
        )}

        {/* Feedback Button for User Messages */}
        {isUser && message.message.trim().length > 0 && (
          <Dialog
            open={feedbackDialogOpen}
            onOpenChange={setFeedbackDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                onClick={handleFeedbackClick}
              >
                <MessageSquare className="mr-1 h-3 w-3" />
                Get Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message Feedback
                </DialogTitle>
                <DialogDescription>
                  AI-powered analysis of your message for grammar, clarity, and
                  suggestions.
                </DialogDescription>
              </DialogHeader>

              {/* Feedback Content */}
              <div className="space-y-4">
                {/* Original Message */}
                <div>
                  <h4 className="mb-2 text-sm font-medium">
                    Original Message:
                  </h4>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    {message.message}
                  </div>
                </div>

                {/* Loading State */}
                {feedbackLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span className="text-muted-foreground text-sm">
                      Analyzing your message...
                    </span>
                  </div>
                )}

                {/* Feedback Results */}
                {feedback && (
                  <div className="space-y-4">
                    {/* Grammar Issues */}
                    {feedback.grammarIssues &&
                      feedback.grammarIssues.length > 0 && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            Grammar Issues
                          </h4>
                          <div className="space-y-2">
                            {feedback.grammarIssues.map((issue, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="mr-2 mb-2"
                              >
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                    {feedback.suggestions &&
                      feedback.suggestions.length > 0 && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            Suggestions
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-sm">
                            {feedback.suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="mt-1 text-blue-500">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {feedback.explanation && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium">
                          Explanation
                        </h4>
                        <p className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-sm">
                          {feedback.explanation}
                        </p>
                      </div>
                    )}

                    {feedback.newSentence &&
                      feedback.newSentence !== feedback.sentence && (
                        <>
                          <SentenceDiff
                            original={feedback.sentence}
                            modified={feedback.newSentence}
                          />
                        </>
                      )}

                    {(!feedback.grammarIssues ||
                      feedback.grammarIssues.length === 0) &&
                      (!feedback.suggestions ||
                        feedback.suggestions.length === 0) && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-700 dark:text-green-300">
                            Great! No significant issues found in your message.
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
}
