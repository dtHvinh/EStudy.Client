import api from "@/components/utils/requestUtils";
import { toast } from "sonner";
import useSWR from "swr";

export interface BlogDetailsResponseType {
  id: number;
  title: string;
  content: string;
  creationDate: string;
  modificationDate: string;
  isReadonly: boolean;
}

export default function useBlogDetail(id: number | string) {
  const { data, isLoading, error, mutate } = useSWR<BlogDetailsResponseType>(
    `/api/blogs/${id}`,
    api.get,
    {
      revalidateOnFocus: false,
    }
  );

  const syncBlog = async (title: string, content: string) => {
    try {
      await api.put(`/api/blogs/${id}`, { title, content });
      mutate();
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync blog.");
      return { success: false };
    }
  };

  return {
    blog: data,
    isLoading,
    error,
    syncBlog,
  };
}
