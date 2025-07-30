import { KokoroTTS, TextSplitterStream } from "kokoro-js";
import { useEffect, useRef, useState } from "react";

const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";

export function useTTS() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ttsRef = useRef<KokoroTTS | null>(null);
  const splitterRef = useRef<TextSplitterStream | null>(null);
  const streamRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize TTS
  useEffect(() => {
    const initializeTTS = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize audio context
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Initialize TTS
        const tts = await KokoroTTS.from_pretrained(model_id, {
          dtype: "fp32",
          // device: "webgpu",
        });

        const splitter = new TextSplitterStream();
        const stream = tts.stream(splitter);

        ttsRef.current = tts;
        splitterRef.current = splitter;
        streamRef.current = stream;

        // Start processing stream
        (async () => {
          try {
            for await (const { text, phonemes, audio } of stream) {
              console.log({ text, phonemes });

              // Play audio - RawAudio has .audio property containing Float32Array
              if (audio && audioContextRef.current) {
                const audioData = audio.audio;
                await playAudio(audioData, audioContextRef.current);
              }
            }
          } catch (streamError) {
            console.error("Stream processing error:", streamError);
          }
        })();

        setIsInitialized(true);
      } catch (err) {
        setError(err as Error);
        console.error("TTS initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTTS();

    // Cleanup on unmount
    return () => {
      if (splitterRef.current) {
        try {
          splitterRef.current.close();
        } catch (e) {
          console.error("Error closing splitter:", e);
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Function to play audio
  const playAudio = async (
    audioData: Float32Array,
    audioContext: AudioContext,
  ) => {
    try {
      const audioBuffer = audioContext.createBuffer(1, audioData.length, 22050); // Kokoro typically uses 22050 Hz
      audioBuffer.copyToChannel(audioData, 0);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const push = (text: string) => {
    if (!splitterRef.current || !isInitialized) {
      console.warn("TTS not initialized yet");
      return;
    }

    try {
      splitterRef.current.push(text);
    } catch (err) {
      console.error("Error pushing text:", err);
      setError(err as Error);
    }
  };

  const flush = () => {
    if (!splitterRef.current || !isInitialized) {
      console.warn("TTS not initialized yet");
      return;
    }

    try {
      splitterRef.current.flush();
    } catch (err) {
      console.error("Error flushing:", err);
      setError(err as Error);
    }
  };

  const close = () => {
    if (!splitterRef.current) return;

    try {
      splitterRef.current.close();
    } catch (err) {
      console.error("Error closing:", err);
    }
  };

  return {
    push,
    flush,
    close,
    isInitialized,
    isLoading,
    error,
  };
}
