import useGetCourses from "@/hooks/use-get-courses";

import { useGenericToggle } from "@/hooks/use-generic-toggle";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import CheckoutForm from "../checkout/checkout-form";
import { ErrorCard } from "../error-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import H3 from "../ui/h3";
import { Input } from "../ui/input";
import api from "../utils/requestUtils";
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
  const { opened, openChange } = useGenericToggle();
  const [clientSecret, setClientSecret] = useState<string>();

  const handleEnroll = async (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      toast.error("Course not found");
      return;
    }
    try {
      const { clientSecret } = await api.post<{ clientSecret: string }>(
        `/api/courses/create-payment-intent`,
        {
          id: courseId,
        },
      );

      setClientSecret(clientSecret);
    } catch (error) {
      toast.error("Failed to load checkout");
      return;
    }
    openChange(true);
  };

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
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={handleEnroll}
            isReadonly={true}
          />
        ))}
        {courses.length === 0 && (
          <div className="text-muted-foreground col-span-full text-center">
            No courses available
          </div>
        )}
      </div>

      <Dialog open={opened} onOpenChange={openChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Portal</DialogTitle>
            <DialogDescription>
              Complete your payment to enroll in the course.
            </DialogDescription>
          </DialogHeader>
          <div>
            {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
