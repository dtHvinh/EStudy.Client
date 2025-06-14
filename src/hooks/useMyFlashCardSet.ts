import { setFormErrors } from "@/components/utils/errorUtils";
import api from "@/components/utils/requestUtils";
import PagedResponse from "@/components/utils/types";
import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
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

  function refresh() {
    mutate();
    setP({
      page: 1,
      pageSize: p.pageSize,
    });
    setHasMore(true);
  }

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

  const addToFavorite = useCallback(
    async (cardSet: FlashCardSetResponseType) => {
      try {
        await api.post(`/api/flash-card-sets/${cardSet.id}/favorite`, {});
        toast.success(`Added "${cardSet.title}" to favorite`);
        mutate((prevData) => {
          if (!prevData) return prevData;

          const updatedItems = prevData.items.map((set) =>
            set.id === cardSet.id ? { ...set, isFavorite: true } : set
          );

          return {
            ...prevData,
            items: updatedItems,
          };
        }, false);
      } catch (error) {
        console.error("Failed to add to favorite:", error);
        toast.error(`Failed to add "${cardSet.title}" to favorite`);
      }
    },
    [mutate]
  );

  const removeFromFavorite = useCallback(
    async (cardSet: FlashCardSetResponseType) => {
      console.log("Removing from favorite:", cardSet);
      try {
        await api.delete(`/api/flash-card-sets/${cardSet.id}/favorite`);
        toast.success(`Removed "${cardSet.title}" from favorite`);
        mutate((prevData) => {
          if (!prevData) return prevData;

          const updatedItems = prevData.items.map((set) =>
            set.id === cardSet.id ? { ...set, isFavorite: false } : set
          );

          return {
            ...prevData,
            items: updatedItems,
          };
        });
      } catch (error) {
        console.error("Failed to remove from favorite:", error); // Fixed error message
        toast.error(`Failed to remove "${cardSet.title}" from favorite`);
      }
    },
    []
  );

  const addSet = useCallback(
    async (
      data: { title: string; description?: string },
      form: UseFormReturn<typeof data>
    ): Promise<boolean> => {
      try {
        const newSet = await api.post<FlashCardSetResponseType>(
          "/api/flash-card-sets",
          data
        );
        toast.success(`Created "${newSet.title}" flash card set`);
        mutate((prevData) => {
          if (!prevData) return prevData;

          return {
            ...prevData,
            items: [newSet, ...prevData.items],
          };
        });
        return true;
      } catch (error) {
        console.error("Failed to create flash card set:", error);
        setFormErrors(error, form.setError);
        toast.error("Failed to create flash card set");
        return false;
      }
    },
    [mutate]
  );

  return {
    favoriteSets,
    nonFavoriteSets,
    getSetError: error,
    isSetLoading: isLoading,
    scrollNext,
    scrollPrev,
    resetPage,
    refresh,
    changePageSize,
    addToFavorite,
    removeFromFavorite,
    addSet,
  };
}
