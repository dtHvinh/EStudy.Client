"use client";

import type {
  GetCourseToLearnLessonResponse,
  GetCourseToLearnQuizResponse,
} from "@/hooks/use-learn-course";
import CourseContentTabs from "./course-content-tabs";
import CourseQuizPlayer from "./course-quiz-player";
import CourseVideoPlayer from "./course-video-player";

export type CourseLessonContentEventProps = {
  onLessonCompleted?: (lessonId: number) => void;
  onQuizCompleted?: (quizId: number) => void;
  onCourseRated?: (rating: number, review: string) => void;
};

export default function CourseContent({
  lesson,
  quiz,
  courseId,
  onLessonCompleted,
  onQuizCompleted,
  onNoteSaved,
  onCourseRated,
}: {
  lesson?: GetCourseToLearnLessonResponse;
  quiz?: GetCourseToLearnQuizResponse;
  courseId: string;
  onNoteSaved?: (lessonId: number, content: string) => void;
} & CourseLessonContentEventProps) {
  return (
    <div>
      {lesson && (
        <CourseVideoPlayer
          lesson={lesson}
          onLessonCompleted={onLessonCompleted}
        />
      )}
      {quiz && (
        <CourseQuizPlayer quiz={quiz} onQuizCompleted={onQuizCompleted} />
      )}

      {/* Content Tabs */}
      <CourseContentTabs
        lesson={lesson}
        quiz={quiz}
        courseId={courseId}
        onNoteSaved={onNoteSaved}
        onCourseRated={onCourseRated}
      />
    </div>
  );
}
