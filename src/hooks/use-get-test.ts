import api from "@/components/utils/requestUtils";
import useSWR from "swr";
import { TestTakingType } from "./use-test-taking";

export default function useGetTest(id: string | number) {
  const { data, isLoading, error } = useSWR<TestTakingType>(
    `/api/tests/${id}`,
    api.get,
  );

  return {
    test: data,
    isLoading,
    error,
  };
}
