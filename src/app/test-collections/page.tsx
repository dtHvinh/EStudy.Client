"use client";

import MainLayout from "@/components/layouts/MainLayout";
import Loading from "@/components/loading";
import RelativeLink from "@/components/relative-link";
import RoleBaseComponent from "@/components/role-base-component";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import { Input } from "@/components/ui/input";
import api from "@/components/utils/requestUtils";
import useTestCollection from "@/hooks/use-test-collection";
import { IconEdit } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { CreateTestCollectionButton } from "../tests/page";

export default function Page() {
  const { inView, ref } = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    500,
  );
  const { collections, mutate, scrollNext, isLoading } = useTestCollection({
    pageSize: 25,
    searchQuery,
  });

  useEffect(() => {
    if (isLoading) {
      toast.message(<Loading text="Loading Collections" />, {
        id: "loading-collections",
      });
    } else {
      toast.dismiss("loading-collections");
    }
  }, [isLoading]);

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <H3>Your Collections</H3>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search..."
                onChange={debouncedSearch}
              />
              <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
                <CreateTestCollectionButton onCollectionCreated={mutate} />
              </RoleBaseComponent>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {collections.map((collection) => (
                <TestCollectionCard
                  key={collection.id}
                  {...collection}
                  onUpdate={mutate}
                />
              ))}
              <div ref={ref} />
              {!isLoading && collections.length === 0 && (
                <div className="col-span-full">
                  There are no test collections available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

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
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <IconEdit className="h-3 w-3" />
      </Button>
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
