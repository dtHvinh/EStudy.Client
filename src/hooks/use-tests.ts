"use client";

import api from "@/components/utils/requestUtils";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";

export interface GetTestResponseType {
  id: string;
  title: string;
  description: string;
  duration: number;
  sectionCount: number;
  commentCount: number;
  questionCount: number;
  attemptCount: number;
  authorName: string;
}

export default function useTests({ pageSize = 10 }: { pageSize?: number }) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getKey = (
    pageIndex: number,
    previousPageData: GetTestResponseType[] | null,
  ) => {
    if (previousPageData && !previousPageData.length) return null;
    const q = new URLSearchParams();
    q.set("page", (pageIndex + 1).toString());
    q.set("pageSize", pageSize.toString());
    if (searchQuery) {
      q.set("q", searchQuery);
    }
    return `/api/tests?${q.toString()}`;
  };

  const search = (query: string) => {
    setSearchQuery(query);
  };

  const { data, isLoading, error, setSize } =
    useSWRInfinite<GetTestResponseType>(getKey, api.get);

  const scrollNext = () => {
    setSize((prevSize) => prevSize + 1);
  };

  return {
    tests: data ? data.flat() : [],
    isTestLoading: isLoading,
    getTestError: error,
    search,
    scrollNext,
  };
}
