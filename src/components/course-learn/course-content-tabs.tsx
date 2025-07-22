"use client";

import type {
  GetCourseToLearnLessonResponse,
  GetCourseToLearnQuizResponse,
} from "@/hooks/use-learn-course";
import HTMLContent from "../html-content";
import { Badge } from "../ui/badge";
import H3 from "../ui/h3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CourseLessonNote from "./course-lesson-note";
import CourseRatings from "./course-rating";

interface CourseContentTabsProps {
  lesson?: GetCourseToLearnLessonResponse;
  quiz?: GetCourseToLearnQuizResponse;
  courseId: string;
  onNoteSaved?: (lessonId: number, content: string) => void;
  onCourseRated?: (rating: number, review: string) => void;
}

export default function CourseContentTabs({
  lesson,
  quiz,
  courseId,
  onNoteSaved,
  onCourseRated,
}: CourseContentTabsProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <Tabs defaultValue="overview">
          <TabsList className="mx-auto w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              {lesson && (
                <div className="space-y-4">
                  <H3 className="font-bold">{lesson.title}</H3>
                  {lesson.description && (
                    <div>
                      <h2 className="mb-5 text-xl font-semibold">
                        Description
                      </h2>
                      <HTMLContent content={lesson.description} />
                    </div>
                  )}
                  {lesson.content && (
                    <div className="prose max-w-none">
                      <h2 className="text-xl font-semibold">Lecture</h2>
                      <HTMLContent content={lesson.content} />
                    </div>
                  )}
                </div>
              )}
              {quiz && (
                <div className="space-y-4">
                  <H3 className="font-bold">{quiz.title}</H3>
                  {quiz.description && (
                    <div>
                      <h2 className="mb-5 text-xl font-semibold">
                        Description
                      </h2>
                      <HTMLContent content={quiz.description} />
                    </div>
                  )}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Questions</span>
                      <Badge variant="secondary">{quiz.questions.length}</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            {lesson && (
              <CourseLessonNote lesson={lesson} onNoteSaved={onNoteSaved} />
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <CourseRatings courseId={courseId} onCourseRated={onCourseRated} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
