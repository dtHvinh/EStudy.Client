import useGetMyCourse, { GetMyCourseType } from "@/hooks/use-get-my-course";
import useStorageV2 from "@/hooks/use-storage-v2";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import H3 from "../ui/h3";
import { Skeleton } from "../ui/skeleton";

export default function DashboardUserCreatedCourses() {
  const { courses, isLoading } = useGetMyCourse();
  return (
    <Card className="border-0">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>
            <H3>My Courses</H3>
          </CardTitle>
          <CardDescription>Track your courses</CardDescription>
        </div>
        <div>
          <Button variant="outline" asChild>
            <Link href={"courses"}>See more</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>
      </CardContent>
    </Card>
  );
}
interface CourseCardProps {
  course: GetMyCourseType;
  onClick?: (course: GetMyCourseType) => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const { getFileUrl } = useStorageV2();
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onClick?.(course)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="mt-4 line-clamp-3">
              {course.description}
            </CardDescription>
          </div>
          {course.imageUrl && (
            <img
              src={course.imageUrl ? getFileUrl(course.imageUrl) : ""}
              alt={course.title}
              className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="mt-auto pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created on</span>
            <span className="font-medium">
              {dayjs(course.creationDate).fromNow()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-16 w-16 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
