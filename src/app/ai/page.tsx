"use client";

import ConversationGrid from "@/components/ai/conversation-grid";
import PageHeader from "@/components/ai/page-header";
import MainLayout from "@/components/layouts/MainLayout";
import Loading from "@/components/loading";
import api from "@/components/utils/requestUtils";
import type { Conversation, CreateConversationFormData } from "@/types/ai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

export default function Page() {
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `/api/ai/conversations?page=${pageIndex + 1}&pageSize=15`; // API endpoint with pagination
  };

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        setSize((prev) => prev + 1);
      }
    },
  });

  const { data, isLoading, error, mutate, setSize } = useSWRInfinite<
    Conversation[]
  >(getKey, api.get);
  const conversations = data ? data.flat() : [];
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      toast.message(<Loading />, {
        id: "loading-toast",
      });
    } else {
      toast.dismiss("loading-toast");
    }
  }, [isLoading, error]);

  const handleCreateConversation = async (
    formData: CreateConversationFormData,
  ) => {
    const newConversation = {
      name: formData.name,
      description: formData.description || undefined,
      context: formData.context,
    };

    await api.post("/api/ai/conversations", newConversation);
    mutate();
    setIsDialogOpen(false);
  };

  const handleConversationClick = (conversation: Conversation) => {
    router.push(`/ai/${conversation.id}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 lg:px-6">
        <PageHeader
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={setIsDialogOpen}
          onCreateConversation={handleCreateConversation}
        />

        <ConversationGrid
          conversations={conversations}
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={setIsDialogOpen}
          onCreateConversation={handleCreateConversation}
          onConversationClick={handleConversationClick}
          onConversationDelete={mutate}
        />
        <div className="h-2" ref={ref}></div>
      </div>
    </MainLayout>
  );
}
