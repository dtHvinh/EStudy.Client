"use client";
import CheckoutForm from "@/components/checkout/checkout-form";
import MainLayout from "@/components/layouts/MainLayout";
import RoleBaseComponent from "@/components/role-base-component";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/components/utils/requestUtils";
import getInitials from "@/components/utils/utilss";
import useCourseDetails, {
  GetCourseDetailsType,
} from "@/hooks/use-course-details";
import { useGenericToggle } from "@/hooks/use-generic-toggle";
import useStorageV2 from "@/hooks/use-storage-v2";

import { IconPencil } from "@tabler/icons-react";
import { Award, Clock, Globe, PlayCircle, Star, Users } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { use, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { course } = useCourseDetails(id);
  const { getFileUrl } = useStorageV2();

  //For payment
  const { opened, openChange } = useGenericToggle();
  const [clientSecret, setClientSecret] = useState<string>();

  const handleEnroll = async () => {
    if (!course) {
      toast.error("Course not found");
      return;
    }
    if (course.price == 0) {
      try {
        await api.post(`/api/courses/${course.id}/enroll-free`, {});
        toast.success("Enrolled in course successfully");
        router.push(`/courses/${course.id}/learn`);
        return;
      } catch (error) {}
    }
    try {
      const { clientSecret } = await api.post<{ clientSecret: string }>(
        `/api/courses/create-payment-intent`,
        {
          id: course.id,
        },
      );

      setClientSecret(clientSecret);
    } catch (error) {
      toast.error("Failed to load checkout");
      return;
    }
    openChange(true);
  };

  return (
    <MainLayout>
      {course && (
        <>
          <div className="px-4 lg:px-6">
            <section className="bg-background border-border border-b">
              <div className="container mx-auto px-4 pb-12">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                  <div className="space-y-6">
                    <h1 className="text-foreground text-4xl leading-tight font-extrabold md:text-5xl">
                      {course.title}
                    </h1>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {course.description}
                    </p>

                    <div className="border-border flex flex-wrap gap-6 border-t border-b py-6">
                      <div className="flex items-center gap-2">
                        <Star className="text-primary h-4 w-4" />
                        <span className="text-foreground font-semibold">
                          {course.averageRating}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({course.ratingCount.toLocaleString()} ratings)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="text-primary h-4 w-4" />
                        <span className="text-foreground font-semibold">
                          {course.studentCount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          students
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="text-primary h-4 w-4" />
                        <span className="text-foreground font-semibold">
                          {course.estimatedDurationHours}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="text-primary h-4 w-4" />
                        <span className="text-foreground font-semibold">
                          {course.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">
                          #{course.difficultyLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      Created by{" "}
                      {course.instructor?.fullName || "Unknown Instructor"}
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <RoleBaseComponent requireRoles={["Student"]}>
                        {course.isEnrolled ? (
                          <Button asChild>
                            <Link href={`/courses/${course.id}/learn`}>
                              Continue
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            onClick={handleEnroll}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transform px-8 py-3 font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                          >
                            Enroll Now - ${course.price}
                          </Button>
                        )}
                      </RoleBaseComponent>
                      <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
                        <Button
                          size="lg"
                          disabled
                          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transform px-8 py-3 font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                        >
                          You are not allowed to enroll
                        </Button>
                      </RoleBaseComponent>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src={
                          course.imageUrl
                            ? getFileUrl(course.imageUrl)
                            : "https://picsum.photos/seed/picsum/600/400"
                        }
                        alt="Course preview"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <CourseInfo course={course} />

            <Dialog open={opened} onOpenChange={openChange}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment Portal</DialogTitle>
                  <DialogDescription>
                    Complete your payment to enroll in the course.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-x-hidden overflow-y-scroll">
                  {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </MainLayout>
  );
}

const CourseInfo = ({ course }: { course: GetCourseDetailsType }) => {
  return (
    <div>
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-8 text-center text-3xl font-bold">
            What you'll learn
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {course.learningObjectives &&
              course.learningObjectives.split("\n")?.map((objective, index) => (
                <div
                  key={index}
                  className="bg-card border-border hover:border-primary hover:shadow-primary/10 flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
                >
                  <Award className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span className="text-foreground">{objective}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Prequisites Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-8 text-center text-3xl font-bold">
            Prequisites
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {course.prerequisites &&
              course.prerequisites.split("\n")?.map((objective, index) => (
                <div
                  key={index}
                  className="bg-card border-border hover:border-primary hover:shadow-primary/10 flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
                >
                  <IconPencil className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <span className="text-foreground">{objective}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-8 text-center text-3xl font-bold">
            Your Instructor
          </h2>
          <Card className="border-border shadow-foreground/5 mx-auto max-w-4xl border bg-transparent shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6 md:flex-row">
                <Avatar className="h-20 w-20 flex-shrink-0">
                  <AvatarImage src={course.instructor?.profilePicture} />
                  <AvatarFallback className="text-xl">
                    {getInitials(course.instructor?.fullName || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 text-2xl font-bold">
                    {course.instructor?.fullName}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {course.instructor?.bio}
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4" />
                      <span>
                        {course.instructor?.averageRating.toFixed(1)} ratings (
                        {course.instructor?.ratingCount})
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>
                        {course.instructor?.studentCount.toLocaleString()}{" "}
                        students
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4" />
                      <span>{course.instructor?.courseCount} courses</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
