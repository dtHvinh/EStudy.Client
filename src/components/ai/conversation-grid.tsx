"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { Conversation, CreateConversationFormData } from "@/types/ai";
import { MessageSquare, Plus } from "lucide-react";
import ConversationCard from "./conversation-card";

interface ConversationGridProps {
  conversations: Conversation[];
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onCreateConversation: (data: CreateConversationFormData) => Promise<void>;
  onConversationClick?: (conversation: Conversation) => void;
  onConversationDelete?: () => void;
}

export default function ConversationGrid({
  conversations,
  isDialogOpen,
  onDialogOpenChange,
  onCreateConversation,
  onConversationClick,
  onConversationDelete,
}: ConversationGridProps) {
  if (conversations.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          No conversations yet
        </h3>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Create your first AI conversation to get started
        </p>
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Conversation
            </Button>
          </DialogTrigger>
        </Dialog>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          onClick={onConversationClick}
          onDelete={onConversationDelete}
        />
      ))}
    </div>
  );
}
