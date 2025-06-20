import { setFormErrors } from "@/components/utils/errorUtils";
import api from "@/components/utils/requestUtils";
import { useCallback, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

export type UseGetCardProps = {
  id: string;
  pageSize: number;
  shuffle?: boolean;
  study?: boolean;
};

export type FlashCardResponseType = {
  id: number;
  term: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  note?: string;
  imageUrl?: string;
  isSkipped?: boolean;
};

export type CreateFlashCardRequestType = {
  term: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  note?: string;
  image?: File;
};

export type EditFlashCardRequestType = {
  id: number;
  term: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  note?: string;
  imageUrl?: string;
};

export default function useSetCards({ ...props }: UseGetCardProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const getKey = (
    pageIndex: number,
    previousPageData: FlashCardResponseType[] | null
  ) => {
    if (previousPageData && !previousPageData.length) return null;
    const params = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      pageSize: props.pageSize.toString(),
    });

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    if (props.shuffle) {
      params.set("shuffle", "true");
    }

    return `/api/flash-card-sets/${props.id}/${
      props.study ? "study" : "cards"
    }?${params.toString()}`;
  };

  const {
    data: cards,
    isLoading,
    setSize,
    mutate,
  } = useSWRInfinite<FlashCardResponseType[]>(getKey, api.get, {
    revalidateOnFocus: false,
  });

  const scrollNext = () => {
    setSize((size) => size + 1);
  };

  const scrollPrev = () => {
    setSize((size) => size - 1);
  };

  const search = (query: string) => {
    setSearchQuery(query);
    setSize(1);
  };

  const resetCards = useCallback(async (setId: string | number) => {
    try {
      await api.patch(`/api/flash-card-sets/${setId}/reset`, {});
      toast.success("Reset successfully!");
      setSize(1);
      return true;
    } catch (error) {
      toast.error("Failed reset.");
      return false;
    }
  }, []);

  const skipCard = useCallback(
    async (cardId: number | string) => {
      try {
        await api.patch(`/api/flash-cards/skip?id=${cardId}`);
        toast.success("Card skipped successfully!");
        mutate();
        return true;
      } catch (error) {
        toast.error("Failed to skip card.");
        return false;
      }
    },
    [mutate]
  );

  const createCard = useCallback(
    async (
      data: CreateFlashCardRequestType,
      form: UseFormReturn<CreateFlashCardRequestType>
    ): Promise<boolean> => {
      try {
        await api.postWithFormData(`/api/flash-cards/add-to/${props.id}`, data);
        toast.success("Card created successfully!");
        mutate();
        return true;
      } catch (error) {
        setFormErrors(error, form.setError);
        toast.error("Failed to create card.");
        return false;
      }
    },
    [props.id, mutate]
  );

  const deleteCard = useCallback(
    async (card: FlashCardResponseType) => {
      try {
        await api.delete(`/api/flash-cards/${card.id}`);
        toast.success("Card deleted successfully!");
        mutate();
      } catch (error) {
        toast.error("Failed to delete card.");
      }
    },
    [mutate]
  );

  const editCard = useCallback(
    async (
      newData: EditFlashCardRequestType,
      form: UseFormReturn<EditFlashCardRequestType>
    ) => {
      try {
        await api.putWithFormData(`/api/flash-cards/${newData.id}`, newData);
        toast.success("Card edited successfully!");
        mutate();
        return true;
      } catch (error) {
        toast.error("Failed to edit card.");
        setFormErrors(error, form.setError);
        return false;
      }
    },
    [mutate]
  );

  return {
    cards: cards ? cards.flat() : [],
    isCardLoading: isLoading,
    scrollNext,
    scrollPrev,
    createCard,
    deleteCard,
    editCard,
    skipCard,
    resetCards,
    search,
  };
}
