import { setFormErrors } from "@/components/utils/errorUtils";
import api from "@/components/utils/requestUtils";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

export type UseGetCardProps = {
  id: string;
  pageSize: number;
};

export type FlashCardResponseType = {
  id: number;
  term: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  note?: string;
  imageUrl?: string;
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
  const getKey = (
    pageIndex: number,
    previousPageData: FlashCardResponseType[] | null
  ) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/flash-card-sets/${props.id}/cards?page=${
      pageIndex + 1
    }&pageSize=${props.pageSize}`;
  };

  const {
    data: cards,
    isLoading,
    setSize,
    mutate,
  } = useSWRInfinite<FlashCardResponseType[]>(getKey, api.get);

  const scrollNext = () => {
    setSize((size) => size + 1);
  };

  const scrollPrev = () => {
    setSize((size) => size - 1);
  };

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
  };
}
