import api from "@/components/utils/requestUtils";
import { useState } from "react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

export interface BlogResponseType {
  id: number;
  title: string;
  creationDate: string;
  modificationDate: string;
}

export interface CreateBlogResponseType {
  id: number;
}

const getKey = (index: number, previousPageData: BlogResponseType[] | null) => {
  if (previousPageData && !previousPageData.length) return null; // reached the
  return `/api/blogs/mine?page=${index + 1}&pageSize=15`; // API endpoint for fetching blogs
};

export default function useBlogs() {
  const {
    data,
    isLoading: isBlogsLoading,
    error: blogError,
    mutate,
  } = useSWRInfinite<BlogResponseType[]>(getKey, api.get);

  const deleteBlog = async (id: number) => {
    try {
      await api.delete(`/api/blogs/${id}`);
      toast.success("Blog deleted successfully!");
      mutate();
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog. Please try again.");
      return { success: false };
    }
  };

  return {
    blogs: data ? data.flat() : [],
    isBlogsLoading,
    blogError,
    deleteBlog,
  };
}

export function useCreateBlog() {
  const [isCreating, setIsCreating] = useState(false);

  const createBlog = async (title: string, content: string) => {
    setIsCreating(true);
    try {
      const { id } = await api.post<CreateBlogResponseType>("/api/blogs", {
        title,
        content,
      });
      toast.success("Blog created successfully!");
      return { success: true, id };
    } catch (error) {
      console.error(error);
      toast.error("Failed to create blog. Please try again.");
      return { success: false, id: null };
    } finally {
      setIsCreating(false);
    }
  };

  const createUntitledBlog = async () => {
    setIsCreating(true);
    try {
      const { id } = await api.post<CreateBlogResponseType>("/api/blogs", {
        title: "untitled",
        content: "",
      });
      toast.success("Blog created successfully!");
      return { success: true, id };
    } catch (error) {
      console.error(error);
      toast.error("Failed to create blog. Please try again.");
      return { success: false, id: null };
    } finally {
      setIsCreating(false);
    }
  };
  return {
    createBlog,
    createUntitledBlog,
    isCreating,
  };
}
