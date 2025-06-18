import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechVoiceType = "us" | "uk" | "default";

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  speak: (text: string, voiceType?: SpeechVoiceType) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  cancel: () => void;
  voices: SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const { rate = 0.8, pitch = 1, volume = 1 } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  // Load voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    // Some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  // Get voice by type
  const getVoice = useCallback(
    (voiceType: SpeechVoiceType): SpeechSynthesisVoice | null => {
      if (voices.length === 0) return null;

      switch (voiceType) {
        case "us":
          return voices.find((v) => v.name === "Google US English") || null;
        case "uk":
          return (
            voices.find((v) => v.name === "Google UK English Female") || null
          );
        case "default":
        default:
          return voices[0] || null;
      }
    },
    [voices]
  );

  // Speak function
  const speak = useCallback(
    (text: string, voiceType: SpeechVoiceType = "default") => {
      if (!isSupported || !text || text.trim() === "") return;

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = getVoice(voiceType);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    },
    [isSupported, rate, pitch, volume, getVoice]
  );

  // Pause function
  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    speechSynthesis.pause();
  }, [isSupported, isSpeaking]);

  // Resume function
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    speechSynthesis.resume();
  }, [isSupported, isPaused]);

  // Stop function
  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, [isSupported]);

  // Cancel function (alias for stop)
  const cancel = useCallback(() => {
    stop();
  }, [stop]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    isSpeaking,
    isPaused,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    cancel,
    voices,
  };
};

// Convenience hooks for specific voice types
export const useSpeechSynthesisUS = (options?: UseSpeechSynthesisOptions) => {
  const speechSynthesis = useSpeechSynthesis(options);

  const speakUS = useCallback(
    (text: string) => {
      speechSynthesis.speak(text, "us");
    },
    [speechSynthesis.speak]
  );

  return {
    ...speechSynthesis,
    speakUS,
  };
};

export const useSpeechSynthesisUK = (options?: UseSpeechSynthesisOptions) => {
  const speechSynthesis = useSpeechSynthesis(options);

  const speakUK = useCallback(
    (text: string) => {
      speechSynthesis.speak(text, "uk");
    },
    [speechSynthesis.speak]
  );

  return {
    ...speechSynthesis,
    speakUK,
  };
};
