"use client";

import { ChatInterface } from "@/components/ai/chat-interface";
import MainLayout from "@/components/layouts/MainLayout";

export default function Page() {
  return (
    <MainLayout childDefaultPadding={false}>
      <div className="h-[calc(100vh-var(--header-height))] overflow-hidden">
        <div className="flex h-full flex-col">
          <ChatInterface />
        </div>
      </div>
    </MainLayout>
  );
}
