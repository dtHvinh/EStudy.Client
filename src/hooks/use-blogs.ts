import api from "@/components/utils/requestUtils";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { BlogResponseType } from "./use-my-blog";

export type UseBlogHookType = {
  pageSize?: number;
};

export default function useBlog({ ...props }: UseBlogHookType) {
  const [q, setQ] = useState<string>("");

  const getKey = (
    index: number,
    previousPageData: BlogResponseType[] | null
  ) => {
    if (previousPageData && !previousPageData.length) return null; // reached the
    const params = new URLSearchParams({
      page: (index + 1).toString(),
      pageSize: props.pageSize ? props.pageSize.toString() : "15",
    });

    if (q) {
      params.set("q", q);
    }

    return `/api/blogs/search?${params.toString()}`; // API endpoint for fetching blogs
  };

  const { data, error, size, setSize, isLoading } = useSWRInfinite<
    BlogResponseType[]
  >(getKey, api.get);

  return {
    blogs: data ? data.flat() : [],
    isBlogLoading: isLoading,
    isGettingBlogError: error,
    search: setQ,
    searchQuery: q,
    scrollNext: () => setSize(size + 1),
  };
}
