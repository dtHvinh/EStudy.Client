import api from "@/components/utils/requestUtils";
import { useEffect, useState } from "react";

export interface SentenceFeedback {
  sentence: string;
  grammarIssues: string[];
  suggestions: string[];
  explanation: string;
  newSentence: string;
}

/**
 * Custom hook to fetch sentence feedback from the AI API.
 * @param sentence The sentence to evaluate.
 * @returns SWR response containing feedback data, loading status, and error.
 */
export function useSentenceFeedback(sentence?: string) {
  const [data, setData] = useState<SentenceFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeedback = async () => {
    if (!sentence) {
      setData(null);
      return;
    }
    if (data) return;

    setIsLoading(true);

    try {
      const response = await api.post<SentenceFeedback>(
        "/api/ai/feedback/sentence",
        {
          sentence,
        },
      );
      setData(response);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sentence) {
      fetchFeedback();
    }
  }, [sentence]);
  console.log(data);
  return {
    feedback: data,
    isLoading,
    refresh: fetchFeedback,
  };
}
