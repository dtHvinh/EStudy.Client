import { getAccessToken } from "@/components/utils/authUtils";
import { API_BASE_URL } from "@/components/utils/requestUtils";
import { useCallback, useRef, useState } from "react";

interface DefinitionData {
  word: string;
  definition: string;
}

export default function useWordDefinition() {
  const [data, setData] = useState<DefinitionData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDefinition = useCallback(async (word: string) => {
    if (!word.trim()) return;

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    setData(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/definition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ word: word.trim() }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let accumulatedData = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.slice(6);
            if (!content) continue;

            accumulatedData += content;

            setData({
              word,
              definition: accumulatedData,
            });
          }
        }
      }

      setIsLoading(false);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        setError(error);
        setIsLoading(false);
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    error,
    isLoading,
    fetchDefinition,
    cancel,
  };
}
