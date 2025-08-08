"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Conversation } from "@/types/ai";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import TextContent from "../content/text-content";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import api from "../utils/requestUtils";

interface ConversationCardProps {
  conversation: Conversation;
  onClick?: (conversation: Conversation) => void;
  onDelete?: () => void;
}

export default function ConversationCard({
  conversation,
  onClick,
  onDelete,
}: ConversationCardProps) {
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/ai/conversations/${id}`);
      toast.success("Conversation deleted successfully");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle
            onClick={() => onClick?.(conversation)}
            className="line-clamp-2 cursor-pointer text-lg hover:underline"
          >
            {conversation.name}
          </CardTitle>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="ml-2 shrink-0">
              {conversation.messageCount} messages
            </Badge>
            <DeleteButton onClick={() => handleDelete(conversation.id)} />
          </div>
        </div>
        {conversation.description && (
          <CardDescription className="line-clamp-2">
            {conversation.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
              Context:
            </p>
            <TextContent
              text={conversation.context}
              className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Created {dayjs(conversation.creationDate).fromNow()}</span>
        <span>Active {dayjs(conversation.lastActive).fromNow()}</span>
      </CardFooter>
    </Card>
  );
}

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant="ghost">
          <IconTrash />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this conversation?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={onClick} variant="destructive">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
