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
import dayjs from "dayjs";
import TextContent from "../content/text-content";

interface ConversationCardProps {
  conversation: Conversation;
  onClick?: (conversation: Conversation) => void;
}

export default function ConversationCard({
  conversation,
  onClick,
}: ConversationCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => onClick?.(conversation)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-lg">
            {conversation.name}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {conversation.messageCount} messages
          </Badge>
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
