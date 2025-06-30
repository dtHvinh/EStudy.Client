import { useCallback, useState } from "react";

export default function useTestQuestionMark() {
  const [markedQuestionIds, setMarkedQuestionIds] = useState<number[]>([]);

  const markQuestion = useCallback((questionId: number) => {
    setMarkedQuestionIds((prev) => [...prev, questionId]);
  }, []);

  const unmarkQuestion = useCallback((questionId: number) => {
    setMarkedQuestionIds((prev) => prev.filter((id) => id !== questionId));
  }, []);

  const isQuestionMarked = useCallback(
    (questionId: number) => {
      return markedQuestionIds.includes(questionId);
    },
    [markedQuestionIds],
  );

  return { markQuestion, unmarkQuestion, isQuestionMarked };
}
