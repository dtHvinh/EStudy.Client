import api from "@/components/utils/requestUtils";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

export interface TestDetailsComment {
  id: string | number;
  text: string;
  creationDate: string;
  author: {
    name: string;
    profilePicture?: string;
  };
  isReadOnly: boolean;
}

type SendCommentResponseType = TestDetailsComment;

export interface TestDetailsSection {
  id: number;
  title: string;
  description: string;
}

export interface TestDetailsType {
  id: number;
  title: string;
  description: string;
  duration: number;
  sectionCount: number;
  attemptCount: number;
  commentCount: number;
  questionCount: number;
  sections: TestDetailsSection[];
  comments: TestDetailsComment[];
}

export default function useTestDetail(id: number | string) {
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const { data, error, isLoading, mutate } = useSWR<TestDetailsType>(
    `/api/tests/details/${id}?comment_page=1&comment_size=5`,
    api.get,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  const loadMoreComments = async () => {
    if (!hasMoreComments || !data) return;

    const response = await api.get<TestDetailsComment[]>(
      `/api/tests/${id}/comments?page=${page + 1}&pageSize=${size}`,
    );
    console.log("Response:", response);
    setHasMoreComments(response.length === size);

    setPage((prevPage) => prevPage + 1);

    mutate((prevData) => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        comments: [...prevData.comments, ...response],
        commentCount: prevData.commentCount + response.length,
      };
    }, false);
  };

  const sendComment = async (text: string) => {
    try {
      const response = await api.post<SendCommentResponseType>(
        `/api/tests/${id}/comments`,
        {
          text,
        },
      );

      mutate((prevData) => {
        if (!prevData) return prevData;

        return {
          ...prevData,
          comments: [response, ...prevData.comments],
          commentCount: prevData.commentCount + 1,
        };
      }, false);
    } catch (error) {
      console.error("Error sending comment:", error);
      throw error;
    }
  };

  const deleteComment = async (id: string | number) => {
    try {
      const { commentId } = await api.delete<{ commentId: string | number }>(
        `/api/comments/${id}`,
      );

      mutate((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          comments: prevData.comments.filter((c) => c.id !== commentId),
          commentCount: prevData.commentCount - 1,
        };
      }, false);

      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
      throw error;
    }
  };
  return {
    details: data,
    isTestLoading: isLoading,
    getTestError: error,
    sendComment,
    deleteComment,
    loadMoreComments,
  };
}
