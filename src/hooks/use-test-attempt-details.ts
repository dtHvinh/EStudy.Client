import api from "@/components/utils/requestUtils";
import useSWR from "swr";
import { UserAnswer } from "./use-test-taking";

export default function useTestAttemptDetails(
  testId: string,
  attemptId: string,
) {
  const {
    data: attempt,
    isLoading,
    error,
  } = useSWR<{
    timeSpent: number;
    earnedPoints: number;
    answerSelections: UserAnswer[];
  }>(`/api/tests/${testId}/attempts/${attemptId}`, api.get, {
    revalidateOnFocus: false,
  });

  return {
    attempt,
    isLoading,
    error,
  };
}
