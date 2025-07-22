"use client";

import CourseContent from "@/components/course-learn/course-content";
import CourseSidebar from "@/components/course-learn/course-sidebar";
import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import NavigateBack from "@/components/navigate-back";
import { Button } from "@/components/ui/button";
import useLearnCourse, {
  GetCourseToLearnLessonResponse,
  GetCourseToLearnQuizResponse,
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
    markLessonAsCompleted,
    markQuizAsCompleted,
  } = useLearnCourse(id);
  const [currentLesson, setCurrentLesson] =
    useState<GetCourseToLearnLessonResponse>();
  const [currentQuiz, setCurrentQuiz] =
    useState<GetCourseToLearnQuizResponse>();

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
      await markLessonAsCompleted(lessonId);
      const nextLesson = getNextLesson(lessonId);
      if (nextLesson) {
        setCurrentLesson(nextLesson);
      }
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
    }
  };

  const handleQuizCompleted = async (quizId: number) => {
    try {
      if (currentQuiz && !currentQuiz.isCompleted)
        await markQuizAsCompleted(quizId);
    } catch (error) {
      console.error("Failed to mark lesson as completed:", error);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (currentLesson && !currentLesson.isCompleted) {
      await handleLessonCompleted(currentLesson.id);
    }
  };

  const handleQuestionSelected = (
    chapterIndex: number,
    lessonIndex: number,
  ) => {
    const selectedLesson = course?.chapters[chapterIndex].lessons[lessonIndex];
    if (selectedLesson) {
      setCurrentLesson(selectedLesson);
      setCurrentQuiz(undefined);
    }
  };

  const handleQuizSelected = (chapterIndex: number, quizIndex: number) => {
    const selectedQuiz = course?.chapters[chapterIndex].quizzes[quizIndex];
    if (selectedQuiz) {
      setCurrentLesson(undefined);
      setCurrentQuiz(selectedQuiz);
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
          <CourseContent
            courseId={id}
            lesson={currentLesson}
            quiz={currentQuiz}
            onLessonCompleted={handleLessonCompleted}
            onQuizCompleted={handleQuizCompleted}
            onNoteSaved={takeNote}
            onCourseRated={rateCourse}
          />
        </div>
        {/* Sidebar */}
        <div className="sticky top-0 col-span-3 h-screen overflow-hidden">
          {course && (
            <CourseSidebar
              currentQuiz={currentQuiz}
              currentLesson={currentLesson}
              chapters={course.chapters}
              onLessionSelected={handleQuestionSelected}
              onQuizSelected={handleQuizSelected}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
