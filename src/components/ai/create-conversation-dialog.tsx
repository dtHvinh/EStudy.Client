"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateConversationFormData } from "@/types/ai";
import { IconFlare } from "@tabler/icons-react";
import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import api from "../utils/requestUtils";

interface CreateConversationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (data: CreateConversationFormData) => Promise<void>;
}

export default function CreateConversationDialog({
  isOpen,
  onOpenChange,
  onCreateConversation,
}: CreateConversationDialogProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [formData, setFormData] = useState<CreateConversationFormData>({
    name: "",
    description: "",
    context: "",
  });

  const handleInputChange = (
    field: keyof CreateConversationFormData,
    value: string,
  ) => {
    if (field === "context" && !value.trim()) {
      setIsEnhanced(false);
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.context.trim()) {
      return;
    }

    await onCreateConversation({
      name: formData.name.trim(),
      description: formData.description.trim(),
      context: formData.context.trim(),
    });

    setFormData({ name: "", description: "", context: "" });
  };

  const handleEnhancePrompt = async () => {
    const currentContext = formData.context.trim();
    setIsEnhancing(true);
    const { prompt } = await api.post("/api/ai/enhance-prompt", {
      prompt: currentContext,
    });

    setFormData((prev) => ({
      ...prev,
      context: prompt,
    }));

    setIsEnhancing(false);
    setIsEnhanced(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Conversation</DialogTitle>
            <DialogDescription>
              Set up a new AI conversation with a specific context and purpose.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Conversation Name *</Label>
              <Input
                autoComplete="off"
                id="name"
                spellCheck="false"
                placeholder="e.g., Project Planning Assistant"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                spellCheck="false"
                id="description"
                autoComplete="off"
                placeholder="Brief description of the conversation purpose"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="context">Context *</Label>
              <Textarea
                id="context"
                spellCheck="false"
                autoComplete="off"
                placeholder="Provide context about what you need help with, your background, or specific requirements..."
                value={formData.context}
                onChange={(e) => handleInputChange("context", e.target.value)}
                rows={4}
                required
              />
              <Button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={!formData.context.trim() || isEnhancing || isEnhanced}
              >
                <IconFlare />
                {isEnhancing
                  ? "Enhancing..."
                  : isEnhanced
                    ? "Enhanced"
                    : "Enhance prompt"}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Conversation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
