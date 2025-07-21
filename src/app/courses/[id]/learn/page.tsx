"use client";

import CourseLessonContent from "@/components/course-learn/course-lesson-content";
import CourseSidebar from "@/components/course-learn/course-sidebar";
import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import useLearnCourse, {
  GetCourseToLearnLessonResponse,
} from "@/hooks/use-learn-course";
import { use, useState } from "react";

export default function CourseLearningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    course,
    error,
    getNextLesson,
    takeNote,
    rateCourse,
    markAsCompleted,
  } = useLearnCourse(id);
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

  const handleLessonCompleted = async (lessonId: number) => {
    try {
      await markAsCompleted(lessonId);
      const nextLesson = getNextLesson(lessonId);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (currentLesson) {
      await handleLessonCompleted(currentLesson.id);
    }
  };

  return (
    <MainLayout
      siteHeader={
        course && (
          <div className="bg-card border-border flex-shrink-0 rounded-t-lg border-b px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <NavigateBack />
                  <div>
                    <h1 className="max-w-md truncate text-xl font-semibold">
                      {course.title}
                    </h1>
                  </div>
                </div>
                <div>
                  {currentLesson && (
                    <Button
                      onClick={handleMarkAsCompleted}
                      disabled={currentLesson.isCompleted}
                      size="sm"
                    >
                      Mark as completed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="-mt-6 grid grid-cols-12">
        {/* Main Content */}
        <div className="col-span-9">
          <CourseLessonContent
            courseId={id}
            lesson={currentLesson}
            onLessonCompleted={handleLessonCompleted}
            onNoteSaved={takeNote}
            onCourseRated={rateCourse}
          />
        </div>
        {/* Sidebar */}
        <div className="sticky top-0 col-span-3 h-screen overflow-hidden">
          {course && (
            <CourseSidebar
              currentLesson={currentLesson}
              chapters={course.chapters}
              onLessionSelected={(chapterIndex, lessonIndex) =>
                setCurrentLesson(
                  course.chapters[chapterIndex].lessons[lessonIndex],
                )
              }
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
