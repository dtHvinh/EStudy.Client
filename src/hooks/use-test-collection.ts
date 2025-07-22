import api from "@/components/utils/requestUtils";
import useSWRInfinite from "swr/infinite";

export type TestCollectionType = {
  id: string;
  name: string;
  description?: string;
};

export default function useTestCollection({
  pageSize = 10,
  searchQuery = "",
}: {
  pageSize?: number;
  searchQuery?: string;
}) {
  const getKey = (
    pageIndex: number,
    previousPageData: TestCollectionType[] | null,
  ) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `/api/tests/test-collections?page=${pageIndex + 1}&pageSize=${pageSize}&query=${encodeURIComponent(searchQuery)}`;
  };

  const { data, error, isLoading, mutate, setSize } = useSWRInfinite<
    TestCollectionType[]
  >(getKey, api.get);

  return {
    collections: data ? data.flat() : [],
    error,
    isLoading,
    mutate,
    scrollNext: () => setSize((size) => size + 1),
  };
}
