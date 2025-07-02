import api from "@/components/utils/requestUtils";
import useSWRInfinite from "swr/infinite";

export interface TestAttempt {
  id: string;
  timeSpent: number;
  earnedPoints: number;
  submitDate: string;
}

export default function useMyTestAttempts({
  testId,
  pageSize = 3,
}: {
  testId: string | number;
  pageSize?: number;
}) {
  const getKey = (
    pageIndex: number,
    previousPageData: TestAttempt[] | null,
  ) => {
    // If there are no previous page data, return the initial URL
    if (previousPageData && previousPageData.length === 0) return null;
    // Return the URL with the current page index
    return `/api/tests/${testId}/attempts?page=${pageIndex + 1}&pageSize=${pageSize}`;
  };

  const {
    data: attempts,
    isLoading,
    error,
    setSize,
  } = useSWRInfinite<TestAttempt[]>(getKey, api.get, {
    revalidateOnFocus: false,
  });

  const scrollNext = () => {
    setSize((size) => size + 1);
  };

  return {
    attempts: attempts ? attempts.flat() : [],
    isLoading,
    error,
    scrollNext,
  };
}
