"use client";

import { ChatInterface } from "@/components/ai/chat-interface";
import MainLayout from "@/components/layouts/MainLayout";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <MainLayout childDefaultPadding={false}>
      <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
        <div className="flex h-full flex-col">
          <ChatInterface conversationId={id} />
        </div>
      </div>
    </MainLayout>
  );
}
