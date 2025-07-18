import useMyLearningCourse from "@/hooks/use-my-learning-course";
import useStorageV2 from "@/hooks/use-storage-v2";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import RelativeLink from "../relative-link";
import RoleBaseComponent from "../role-base-component";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import H3 from "../ui/h3";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import StudentPageCourses from "./student-page-course";

export default function StudentPage() {
  const { courses, isLoading, scrollNext } = useMyLearningCourse();
  const { getFileUrl } = useStorageV2();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex-1 space-y-6">
        <div className="rounded-lg">
          <div className="max-w-2xl">
            <H3>Learn Without Limits</H3>
            <p className="mb-6 text-xl opacity-90">
              Start, switch, or advance your career with thousands of courses,
              Professional Certificates, and degrees from world-class
              instructors.
            </p>
            <div className="flex items-center gap-4">
              <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
                <Button size="lg" variant={"outline"}>
                  <RelativeLink href={"builder"}>Create a course</RelativeLink>
                </Button>
              </RoleBaseComponent>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="browse">Browse Courses</TabsTrigger>
          <TabsTrigger value="enrolled">My Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div>
            <StudentPageCourses />
          </div>
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Continue Learning</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {courses.map((course) => (
                <RelativeLink href={`${course.id}/learn`} key={course.id}>
                  <Card className="border-0 shadow-sm transition-transform hover:scale-105">
                    <CardContent>
                      <div className="flex gap-4">
                        <img
                          src={
                            course.imageUrl
                              ? getFileUrl(course.imageUrl)
                              : "https://picsum.photos/seed/picsum/352/192"
                          }
                          alt={course.title}
                          className="h-16 w-24 rounded object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {course.completionPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <Progress
                              value={course.completionPercentage}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </RelativeLink>
              ))}
              <div ref={ref} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
