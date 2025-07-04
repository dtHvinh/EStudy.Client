import useGetCourse from "@/hooks/use-get-course";
import H3 from "../ui/h3";
import { CourseGrid } from "./course-grid";

export default function InstructorPage() {
  const { courses, isLoading, error, scrollNext } = useGetCourse();
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 lg:px-6">
      <H3>Your courses</H3>
      <p className="text-muted-foreground">
        Here you can manage your courses, including creating, editing, and
        deleting them.
      </p>
      <CourseGrid courses={courses} loading={isLoading} />
    </div>
  );
}
