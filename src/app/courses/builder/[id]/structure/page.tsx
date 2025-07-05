"use client";

import CourseStructure from "@/components/course-builder/course-structure";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import useCourseDetails from "@/hooks/use-course-details";
import { useCreateCourseStructure } from "@/hooks/use-create-course-structure";
import { SaveIcon } from "lucide-react";
import { use, useEffect } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string | number }>;
}) {
  const { id } = use(params);
  const { course } = useCourseDetails(id);
  const { chapters, resetStructure, pendingUploadFiles } =
    useCreateCourseStructure();

  useEffect(() => {
    return () => {
      resetStructure();
    };
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl p-6">
        {course && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{course.title}'s structure</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your course stiructure, including modules,
                lessons, and resources.
              </p>
            </div>
            <div>
              <Button
                onClick={() => {
                  console.log("Chapters", chapters);
                  console.log("Files", pendingUploadFiles);
                }}
                variant="ghost"
              >
                <SaveIcon />
              </Button>
            </div>
          </div>
        )}

        <div>
          <CourseStructure />
        </div>
      </div>
    </MainLayout>
  );
}
