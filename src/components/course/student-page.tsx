import { Progress } from "@radix-ui/react-progress";
import { Play } from "lucide-react";
import RelativeLink from "../relative-link";
import RoleBaseComponent from "../role-base-component";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { mock_enrolledCourses } from "../utils/old";
import StudentPageCourses from "./student-page-course";

export default function StudentPage() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex-1 space-y-6">
        <div className="rounded-lg">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold">Learn Without Limits</h1>
            <p className="mb-6 text-xl opacity-90">
              Start, switch, or advance your career with thousands of courses,
              Professional Certificates, and degrees from world-class
              instructors.
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg">Explore Courses</Button>
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
            <div className="grid gap-4 md:grid-cols-2">
              {mock_enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Next: {course.nextLesson}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            {course.timeLeft} left
                          </span>
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Courses Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Hours Learned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Certificates Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
