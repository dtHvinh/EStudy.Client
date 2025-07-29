"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Send, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface VoiceInputProps {
  onSubmit: (transcript: string) => void;
  isLoading: boolean;
  currentTranscript: string;
  onTranscriptChange: (transcript: string) => void;
}

export function VoiceInput({
  onSubmit,
  isLoading,
  currentTranscript,
  onTranscriptChange,
}: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [autoSendTimer, setAutoSendTimer] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const SECOND_BEFORE_AUTO_SEND = 1; //

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setIsSupported(browserSupportsSpeechRecognition && isMicrophoneAvailable);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "v" || event.key === "V") {
        startListening();
      }
    };

    if (browserSupportsSpeechRecognition && isMicrophoneAvailable) {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Update parent component with transcript changes
  useEffect(() => {
    if (transcript !== currentTranscript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, currentTranscript, onTranscriptChange]);

  // Handle auto-send timer
  useEffect(() => {
    if (listening && transcript.trim()) {
      // Clear existing timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      // Start SECOND_BEFORE_AUTO_SEND-second countdown
      setCountdown(SECOND_BEFORE_AUTO_SEND);
      setAutoSendTimer(SECOND_BEFORE_AUTO_SEND);

      // Countdown interval
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-send timer
      timerRef.current = setTimeout(() => {
        if (transcript.trim()) {
          handleAutoSend();
        }
      }, SECOND_BEFORE_AUTO_SEND * 1000);
    } else if (!listening) {
      // Clear timers when not listening
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      setAutoSendTimer(null);
      setCountdown(0);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [listening, transcript]);

  const handleAutoSend = useCallback(() => {
    if (transcript.trim()) {
      SpeechRecognition.stopListening();
      onSubmit(transcript.trim());
      resetTranscript();
      setAutoSendTimer(null);
      setCountdown(0);

      // Clear timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }
  }, [transcript, onSubmit, resetTranscript]);

  const startListening = () => {
    resetTranscript();
    onTranscriptChange("");
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      onSubmit(transcript.trim());
      resetTranscript();
      onTranscriptChange("");
    }
  };

  const cancelListening = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    onTranscriptChange("");
    setAutoSendTimer(null);
    setCountdown(0);

    // Clear timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <MicOff className="h-6 w-6" />
          <span>Voice input not supported in this browser</span>
        </div>
        <p className="text-muted-foreground max-w-md text-xs">
          Please use a modern browser like Chrome, Edge, or Safari for voice
          input functionality.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Voice Status Display */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="bg-primary/10 rounded-full p-3"
              >
                <Volume2 className="text-primary h-6 w-6" />
              </motion.div>
              <div>
                <p className="text-primary text-sm font-medium">Listening...</p>
                {autoSendTimer && countdown > 0 && (
                  <p className="text-muted-foreground text-xs">
                    Auto-sending in {countdown}s
                  </p>
                )}
              </div>
            </div>

            {/* Auto-send progress bar */}
            {autoSendTimer && (
              <motion.div
                className="bg-muted h-1 w-32 overflow-hidden rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: SECOND_BEFORE_AUTO_SEND,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {!listening ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              size="lg"
              className={cn(
                "h-16 w-16 rounded-full p-0 shadow-lg",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
              )}
              onClick={startListening}
              disabled={isLoading}
            >
              <Mic className="h-8 w-8" />
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center gap-7">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                className="h-12 w-12 rounded-full p-0"
                onClick={cancelListening}
              >
                <MicOff className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="h-12 w-12 rounded-full p-0"
                onClick={stopListening}
                disabled={!transcript.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        {!listening ? (
          <div>
            <p className="text-muted-foreground text-sm">
              Click the microphone or press <strong>'V'</strong> to start
              speaking
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground max-w-md text-xs">
            Speak your message. It will be sent automatically when you stop
            speaking, or click the send button to send immediately.
          </p>
        )}
      </motion.div>
    </div>
  );
}
