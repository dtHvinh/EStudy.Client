"use client";

import type { CreateConversationFormData } from "@/types/ai";
import H3 from "../ui/h3";
import CreateConversationDialog from "./create-conversation-dialog";

interface PageHeaderProps {
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onCreateConversation: (data: CreateConversationFormData) => Promise<void>;
}

export default function PageHeader({
  isDialogOpen,
  onDialogOpenChange,
  onCreateConversation,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <H3>Conversation History</H3>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage and review your AI conversations
        </p>
      </div>

      <CreateConversationDialog
        isOpen={isDialogOpen}
        onOpenChange={onDialogOpenChange}
        onCreateConversation={onCreateConversation}
      />
    </div>
  );
}
