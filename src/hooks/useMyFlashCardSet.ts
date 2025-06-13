import api from "@/components/utils/requestUtils";
import PagedResponse from "@/components/utils/types";
import { useState } from "react";
import useSWR from "swr";

export interface FlashCardSetResponseType {
  id: number;
  title: string;
  description: string;
  lastAccess: string | null;
  progress: number;
  isFavorite: boolean;
  cardCount: number;
}

export interface GetUserFlashCardSetProps {
  page: number;
  pageSize: number;
  onScrollFail?: () => void;
}

export default function useMyFlashCardSet({
  ...props
}: GetUserFlashCardSetProps) {
  const [p, setP] = useState({
    page: props.page,
    pageSize: props.pageSize,
  });
  const [hasMore, setHasMore] = useState(true);
  const { data, error, isLoading, mutate } = useSWR<
    PagedResponse<FlashCardSetResponseType>
  >(`/api/flash-card-sets/mine?page=${p.page}&pageSize=${p.pageSize}`, api.get);

  const favoriteSets = data ? data.items.filter((set) => set.isFavorite) : [];

  const nonFavoriteSets = data
    ? data.items.filter((set) => !set.isFavorite)
    : [];

  function scrollNext() {
    if (hasMore)
      setP({
        page: p.page + 1,
        pageSize: p.pageSize,
      });
    else {
      props.onScrollFail?.();
    }

    if (data && data.items.length < p.pageSize) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }

  function scrollPrev() {
    if (p.page > 1)
      setP({
        page: p.page - 1,
        pageSize: p.pageSize,
      });
  }

  function changePageSize(newPage: number) {
    setP({
      page: 1,
      pageSize: newPage,
    });
  }

  function resetPage() {
    setP((prev) => ({
      ...prev,
      page: 1,
    }));
  }

  return {
    favoriteSets,
    nonFavoriteSets,
    scrollNext,
    scrollPrev,
    resetPage,
    changePageSize,
  };
}
