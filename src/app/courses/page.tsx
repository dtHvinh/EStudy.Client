"use client";

import MainLayout from "@/components/layouts/MainLayout";
import RelativeLink from "@/components/relative-link";
import RoleBaseComponent from "@/components/role-base-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mock_enrolledCourses,
  mock_featuredCourses,
} from "@/components/utils/old";
import { BookOpen, Clock, Play, Star, TrendingUp, Users } from "lucide-react";

export default function Page() {
  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex-1 space-y-6 p-6">
          <div className="rounded-lg p-8">
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
                    <RelativeLink href={"builder"}>
                      Create a course
                    </RelativeLink>
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
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Courses
                  </CardTitle>
                  <BookOpen className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847</div>
                  <p className="text-muted-foreground text-xs">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Students
                  </CardTitle>
                  <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-muted-foreground text-xs">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Course Completion
                  </CardTitle>
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-muted-foreground text-xs">
                    +3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Courses */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="mb-4 text-2xl font-bold">Featured Courses</h2>
              </div>
              <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3`}>
                {mock_featuredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                        <Button
                          size="sm"
                          className="bg-white/90 text-black hover:bg-white"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={course.authorAvatar || "https://placehold.co/"}
                          />
                          <AvatarFallback>{course.author[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-sm">
                          {course.author}
                        </span>
                      </div>

                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students.toLocaleString("en")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            ${course.price}
                          </span>
                          <span className="text-muted-foreground text-sm line-through">
                            ${course.originalPrice}
                          </span>
                        </div>
                        <Button
                          className={
                            course.isEnrolled
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          {course.isEnrolled
                            ? "Continue Learning"
                            : "Enroll Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
    </MainLayout>
  );
}
