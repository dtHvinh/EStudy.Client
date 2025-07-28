"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function VoiceInput({
  onTranscript,
  onSubmit,
  isLoading,
}: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(true);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setIsSupported(browserSupportsSpeechRecognition && isMicrophoneAvailable);
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      onSubmit();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <MicOff className="h-4 w-4" />
        <span>Voice input not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-primary flex items-center gap-2 text-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <Volume2 className="h-4 w-4" />
            </motion.div>
            <span>Listening...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="button"
        variant={listening ? "destructive" : "ghost"}
        size="sm"
        className={cn(
          "h-8 w-8 p-0 transition-all duration-200",
          listening && "animate-pulse",
        )}
        onClick={listening ? stopListening : startListening}
        disabled={isLoading}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {listening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </motion.div>
      </Button>
    </div>
  );
}
