import api from "@/components/utils/requestUtils";
import useSWRInfinite from "swr/infinite";
import { MessageType } from "./use-streaming-voice-chat";

export default function useConversationMessage(
  conversationId: string | number,
) {
  const { data, error, isLoading, setSize } = useSWRInfinite<MessageType[]>(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null;
      return `/api/ai/conversations/${conversationId}/messages?page=${pageIndex + 1}&pageSize=15`;
    },
    api.get,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const scrollNext = () => setSize((prev) => prev + 1);
  const messages = data ? data.flat().reverse() : [];
  return { messages, error, isLoading, scrollNext };
}
