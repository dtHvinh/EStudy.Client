import api from "@/components/utils/requestUtils";
import PagedResponse from "@/components/utils/types";
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
  page?: number;
  pageSize?: number;
}

export default function useMyFlashCardSet({
  ...props
}: GetUserFlashCardSetProps) {
  const { data, error, isLoading, mutate } = useSWR<
    PagedResponse<FlashCardSetResponseType>
  >(
    `/api/flash-card-sets/mine?page=${props.page ?? 1}&pageSize=${
      props.pageSize ?? 10
    }`,
    api.get
  );

  return {
    sets: data,
    getSetError: error,
    isGetSetLoading: isLoading,
    mutateSet: mutate,
  };
}
