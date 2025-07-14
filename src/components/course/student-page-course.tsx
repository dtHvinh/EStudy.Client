import useGetCourses from "@/hooks/use-get-courses";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { ErrorCard } from "../error-card";
import H3 from "../ui/h3";
import { Input } from "../ui/input";
import { CourseCard } from "./course-card";

export default function StudentPageCourses() {
  const [search, setSearch] = useState("");
  const { courses, isLoading, error } = useGetCourses({ query: search });
  const debounceSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    500,
  );

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading courses...", {
        id: "loading-courses",
      });
    } else {
      toast.dismiss("loading-courses");
    }
  }, [isLoading]);

  if (error) {
    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <H3>Courses</H3>
        </div>
        <ErrorCard message={"Failed to load courses"} />
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <H3>Courses</H3>
        <Input
          type="text"
          placeholder="Search courses..."
          className="w-64 focus:border-0 focus:ring-0"
          onChange={debounceSearch}
        />
      </div>
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} isReadonly={true} />
        ))}
        {courses.length === 0 && (
          <div className="text-muted-foreground col-span-full text-center">
            No courses available
          </div>
        )}
      </div>
    </>
  );
}
