import { setFormErrors } from "@/components/utils/errorUtils";
import api from "@/components/utils/requestUtils";
import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

export interface FlashCardSetResponseType {
  id: number;
  title: string;
  description?: string;
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

type EditFlashCardSetData = {
  id: number;
  title: string;
  description?: string;
};

export type EditFlashCardSetParamType = {
  data: EditFlashCardSetData;
  form: UseFormReturn<EditFlashCardSetData>;
};

export default function useMyFlashCardSet({
  ...props
}: GetUserFlashCardSetProps) {
  const [page, setPage] = useState(props.page);
  const [pageSize, setPageSize] = useState(props.pageSize);
  const { data, error, size, setSize, isLoading, mutate } = useSWRInfinite<
    FlashCardSetResponseType[]
  >(
    (index) =>
      `/api/flash-card-sets/mine?page=${index + 1}&pageSize=${pageSize}`,
    api.get
  );

  const items = data ? data.flat() : [];

  function scrollNext() {
    setSize(size + 1);
  }

  function refresh() {
    mutate();
  }

  function scrollPrev() {
    setSize(size - 1);
  }

  const addToFavorite = useCallback(
    async (cardSet: FlashCardSetResponseType) => {
      try {
        await api.post(`/api/flash-card-sets/${cardSet.id}/favorite`, {});
        toast.success(`Added "${cardSet.title}" to favorite`);
        mutate();
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
        mutate();
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
        mutate();
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

  const editSet = useCallback(
    async ({ data, form }: EditFlashCardSetParamType): Promise<boolean> => {
      try {
        await api.put<FlashCardSetResponseType>(
          `/api/flash-card-sets/${data.id}`,
          {
            title: data.title,
            description: data.description,
          }
        );
        toast.success(`Flash card set updated`);
        items.map((set) =>
          set.id === data.id
            ? { ...set, title: data.title, description: data.description }
            : set
        );
        mutate();
        return true;
      } catch (error) {
        console.error("Failed to update flash card set:", error);
        setFormErrors(error, form.setError);
        toast.error("Failed to update flash card set");
        return false;
      }
    },
    [mutate]
  );

  const deleteSet = useCallback(
    async (cardSet: FlashCardSetResponseType): Promise<boolean> => {
      try {
        await api.delete(`/api/flash-card-sets/${cardSet.id}`);
        toast.success(`Deleted flash card set`);
        mutate();
        return true;
      } catch (error) {
        console.error("Failed to delete flash card set:", error);
        toast.error("Failed to delete flash card set");
        return false;
      }
    },
    [mutate]
  );

  return {
    sets: data ? data.flat() : [],
    getSetError: error,
    isSetLoading: isLoading,
    scrollNext,
    scrollPrev,
    refresh,
    addToFavorite,
    removeFromFavorite,
    addSet,
    editSet,
    deleteSet,
  };
}
