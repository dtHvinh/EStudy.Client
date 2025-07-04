"use client";
import { CourseHeader } from "./course-header";

export function CourseDetailBuilder() {
  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your course content
          </p>
        </div>
      </div>

      <div>
        <CourseHeader />
      </div>
    </div>
  );
}
