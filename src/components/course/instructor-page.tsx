import useGetMyCourse from "@/hooks/use-get-my-course";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import RelativeLink from "../relative-link";
import { Button } from "../ui/button";
import H3 from "../ui/h3";
import { CourseGrid } from "./course-grid";

export default function InstructorPage() {
  const { courses, isLoading, error, scrollNext } = useGetMyCourse();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <H3>Your courses</H3>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <RelativeLink href="builder">Create a course</RelativeLink>
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        Here you can manage your courses, including creating, editing, and
        deleting them.
      </p>
      <CourseGrid courses={courses} loading={isLoading} />
      <div ref={ref} />
    </div>
  );
}
