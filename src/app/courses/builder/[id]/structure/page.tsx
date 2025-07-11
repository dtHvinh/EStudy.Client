"use client";

import CourseHeader from "@/components/course-builder/course-header";
import CourseStructure from "@/components/course-builder/course-structure";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import api from "@/components/utils/requestUtils";
import useCourseDetails from "@/hooks/use-course-details";
import { useEditCourseStructure } from "@/hooks/use-edit-course-structure";
import useGetCourseStructure from "@/hooks/use-get-course-structure";
import { IconGlobe, IconWorld } from "@tabler/icons-react";
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
  const {
    resetStructure,
    getChapters,
    setChapters,
    isDirty,
    setCourseId,
    publishCourse,
    isPublished,
    setCourseDetails,
    getDetails,
  } = useEditCourseStructure(
    useShallow((state) => ({
      resetStructure: state.resetStructure,
      getChapters: state.getChapters,
      setChapters: state.setChapters,
      isDirty: state.isDirty,
      setCourseId: state.setCourseId,
      publishCourse: state.publishCourse,
      isPublished: state.isPublished,
      setCourseDetails: state.setDetails,
      getDetails: state.getDetails,
    })),
  );

  useEffect(() => {
    if (courseStructure) {
      setChapters(courseStructure.chapters);
      setCourseId(courseStructure.courseId);
      console.log("Course structure loaded:", courseStructure);
    }
  }, [courseStructure]);

  useEffect(() => {
    if (course) {
      setCourseDetails({
        ...course,
      });
    }
  }, [course]);

  const handleEdit = async () => {
    try {
      await api.put(`/api/courses/${course?.id}/structure`, {
        chapters: getChapters(),
        ...getDetails(),
        isPublished: isPublished,
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
                <h1 className="max-w-3xl text-3xl font-bold">
                  {course.title}'s structure
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage your course stiructure, including modules,
                  lessons, and resources.
                </p>
              </div>
              <div>
                {courseStructure.isPublished ? (
                  <Button variant="ghost" className="ml-2" disabled>
                    <IconGlobe /> Published
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="ml-2"
                    onClick={publishCourse}
                  >
                    <IconWorld /> Publish Course
                  </Button>
                )}
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
            <CourseHeader />
          </div>
          <div>
            <CourseStructure />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
