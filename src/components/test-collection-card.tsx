"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/components/utils/requestUtils";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import RelativeLink from "./relative-link";

export const TestCollectionCard = ({
  id,
  name,
  description,
  onUpdate,
}: {
  id: string;
  name: string;
  description?: string;
  onUpdate?: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditName(name);
    setEditDescription(description || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(name);
    setEditDescription(description || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/api/tests/test-collections/${id}`, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      toast.success("Collection updated successfully!");
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await api.delete(`/api/tests/test-collections/${id}`);
      toast.success("Collection deleted successfully!");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to delete collection");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative flex h-32 items-center justify-center rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 shadow-sm">
        <form onSubmit={handleSave} className="w-full space-y-2">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Collection name"
            className="h-8 text-sm"
            disabled={isSubmitting}
            spellCheck={false}
            autoFocus
          />
          <Input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            className="h-8 text-sm"
            disabled={isSubmitting}
            spellCheck={false}
          />
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-6 px-2 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!editName.trim() || isSubmitting}
              className="h-6 px-2 text-xs"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="group relative flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 shadow-sm hover:border-gray-400">
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <IconEdit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
        >
          <IconTrash className="h-3 w-3" />
        </Button>
      </div>
      <div className="text-center">
        <RelativeLink key={id} href={`${id}`}>
          <p className="text-lg font-semibold text-gray-800 hover:underline">
            {name}
          </p>
        </RelativeLink>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};
