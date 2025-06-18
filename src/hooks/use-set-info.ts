import api from "@/components/utils/requestUtils";
import useSWR from "swr";
import { FlashCardSetResponseType } from "./useMyFlashCardSet";

export default function useSetInfo(id: string) {
  const { data, isLoading, error, mutate } = useSWR<FlashCardSetResponseType>(
    `/api/flash-card-sets/${id}`,
    api.get
  );

  return {
    setInfo: data,
    isLoading,
    error,
    setInfoMutate: mutate,
  };
}
