"use client";

import { GetMyCourseType } from "@/hooks/use-get-my-course";
import { CourseCard } from "./course-card";

interface CourseGridProps {
  courses: GetMyCourseType[];
  onEnroll?: (courseId: number) => void;
  onViewDetails?: (courseId: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function CourseGrid({
  courses,
  onEnroll,
  onViewDetails,
  loading = false,
  emptyMessage = "No courses found",
}: CourseGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted mb-4 h-48 rounded-lg" />
            <div className="space-y-2">
              <div className="bg-muted h-4 w-3/4 rounded" />
              <div className="bg-muted h-4 w-1/2 rounded" />
              <div className="bg-muted h-4 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-12r">
        <div className="text-muted-foreground text-lg">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          isReadonly={false}
          key={course.id}
          course={course}
          onEnroll={onEnroll}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
