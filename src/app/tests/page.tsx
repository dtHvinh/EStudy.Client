"use client";

import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import RelativeLink from "@/components/relative-link";
import RoleBaseComponent from "@/components/role-base-component";
import TestCard from "@/components/test-card";
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
import H3 from "@/components/ui/h3";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/components/utils/requestUtils";
import useTestCollection, {
  TestCollectionType,
} from "@/hooks/use-test-collection";
import useTests from "@/hooks/use-tests";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

export default function Page() {
  const { tests, scrollNext, isTestLoading, getTestError, refresh } = useTests({
    pageSize: 15,
  });
  const { collections, mutate } = useTestCollection({
    pageSize: 5,
  });
  const { inView, ref } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  if (!isTestLoading && getTestError) {
    return (
      <MainLayout>
        <ErrorCard
          title="Failed to load tests"
          message="We couldn't retrieve your tests. Please try again later."
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <H3>Tests</H3>
            <div className="flex items-center gap-2">
              <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
                <CreateTestButton />
              </RoleBaseComponent>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {tests.map((item) => (
                <TestCard onTestDeleted={refresh} key={item.id} {...item} />
              ))}
              {tests.length === 0 && (
                <div className="col-span-full">
                  There are no tests available in the library.
                </div>
              )}
              <div ref={ref} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const CreateTestButton = () => {
  return (
    <Button variant={"ghost"}>
      <RelativeLink className="flex items-center gap-1" href={"builder"}>
        <IconPlus /> Test
      </RelativeLink>
    </Button>
  );
};

export const CreateTestCollectionButton = ({
  onCollectionCreated,
}: {
  onCollectionCreated?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    setName("");
    setDescription("");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post<TestCollectionType>(
        "/api/tests/test-collections",
        {
          name: name.trim(),
          description: description.trim(),
        },
      );
      toast.success("Collection created successfully!");
      onCollectionCreated?.();
      handleCancel();
    } catch (error) {
      toast.error("Failed to create collection");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <IconPlus /> Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your items. Give it a name and
            description to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                autoComplete="off"
                spellCheck={false}
                id="name"
                placeholder="Enter collection name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                spellCheck={false}
                id="description"
                placeholder="Enter collection description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="col-span-3 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCancel}
              type="button"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
