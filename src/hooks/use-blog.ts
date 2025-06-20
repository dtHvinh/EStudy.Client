import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export interface BlogResponseType {
  id: number;
  title: string;
  content: string;
  creationDate: string;
  modificationDate: string;
}

export default function useBlog() {
  const {
    data: blogs,
    isLoading: isBlogsLoading,
    error: blogError,
  } = useSWR<BlogResponseType[]>("/api/blogs/mine", api.get);

  const createBlog = async (title: string, content: string) => {
    await api.post<BlogResponseType>("/api/blogs", {
      title,
      content,
    });
  };

  return {
    blogs,
    isBlogsLoading,
    blogError,
    createBlog,
  };
}
