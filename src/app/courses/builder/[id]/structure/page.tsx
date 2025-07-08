"use client";

import CourseStructure from "@/components/course-builder/course-structure";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import api from "@/components/utils/requestUtils";
import useCourseDetails from "@/hooks/use-course-details";
import { useCreateCourseStructure } from "@/hooks/use-create-course-structure";
import useGetCourseStructure from "@/hooks/use-get-course-structure";
import { SaveIcon } from "lucide-react";
import { use, useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

export default function Page({
  params,
}: {
  params: Promise<{ id: string | number }>;
}) {
  const { id } = use(params);
  const { course } = useCourseDetails(id);
  const { courseStructure, isLoading, error, mutate } =
    useGetCourseStructure(id);

  const resetStructure = useCreateCourseStructure(
    (state) => state.resetStructure,
  );
  const getChapters = useCreateCourseStructure(
    useShallow((state) => state.getChapters),
  );
  const setChapters = useCreateCourseStructure(
    useShallow((state) => state.setChapters),
  );
  const isDirty = useCreateCourseStructure(
    useShallow((state) => state.isDirty),
  );
  const setCourseId = useCreateCourseStructure(
    useShallow((state) => state.setCourseId),
  );

  useEffect(() => {
    if (courseStructure) {
      setChapters(courseStructure.chapters);
      setCourseId(courseStructure.courseId);
    }
  }, [courseStructure]);

  const handleEdit = async () => {
    try {
      await api.put(`/api/courses/${course?.id}/structure`, {
        chapters: getChapters(),
      });
      mutate();
      toast.success("Course structure updated successfully");
    } catch (error) {
      toast.error("Failed to update course structure");
    }
  };

  useEffect(() => {
    return () => {
      resetStructure();
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load course structure");
    }
  }, [error]);

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading course structure...");
    } else {
      toast.dismiss();
    }
  }, [isLoading]);

  return (
    <MainLayout>
      {courseStructure && (
        <div className="container mx-auto max-w-6xl p-6">
          {course && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <NavigateBack label="Back to course" fallbackUrl="/courses" />
                <h1 className="text-3xl font-bold">
                  {course.title}'s structure
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage your course stiructure, including modules,
                  lessons, and resources.
                </p>
              </div>
              <div>
                <Button
                  disabled={!isDirty}
                  onClick={handleEdit}
                  variant="ghost"
                >
                  <SaveIcon /> Save Changes
                </Button>
              </div>
            </div>
          )}

          <div>
            <CourseStructure />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
