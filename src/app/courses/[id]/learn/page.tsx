"use client";

import CourseLessonContent from "@/components/course-learn/course-lesson-content";
import CourseSidebar from "@/components/course-learn/course-sidebar";
import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import useLearnCourse, {
  GetCourseToLearnLessonResponse,
} from "@/hooks/use-learn-course";
import { ChevronLeft, Star } from "lucide-react";
import { use, useState } from "react";

export default function CourseLearningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { course, error } = useLearnCourse(id);
  const [currentLesson, setCurrentLesson] =
    useState<GetCourseToLearnLessonResponse>();

  if (error) {
    return (
      <MainLayout>
        <ErrorCard
          title="Failed to load course"
          message="You have to enroll to this course to access it "
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      siteHeader={
        course && (
          <div className="bg-card border-border flex-shrink-0 rounded-t-lg border-b px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="max-w-md truncate text-xl font-semibold">
                    {course.title}
                  </h1>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.averageRating}</span>
                    <span>•</span>
                    <span>{course.studentCount} students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="-mt-6 grid grid-cols-11">
        {/* Main Content */}
        <CourseLessonContent lesson={currentLesson} />
        {/* Sidebar */}
        <div className="sticky top-0 col-span-3 h-screen overflow-hidden">
          {course && (
            <CourseSidebar
              chapters={course.chapters}
              onLessionSelected={(lessonIndex) =>
                setCurrentLesson(course.chapters[0].lessons[lessonIndex])
              }
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
