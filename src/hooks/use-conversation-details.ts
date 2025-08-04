import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export type ConversationDetails = {
  id: string;
  name: string;
  description?: string;
  context: string;
};

export default function useConversationDetails(conversationId: string) {
  const { data, isLoading, error } = useSWR<ConversationDetails>(
    `/api/ai/conversations/${conversationId}`,
    api.get,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  return {
    details: data,
    isLoading,
    error,
  };
}
