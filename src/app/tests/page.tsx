"use client";

import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import RelativeLink from "@/components/relative-link";
import RoleBaseComponent from "@/components/role-base-component";
import TestCard from "@/components/test-card";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";
import useTests from "@/hooks/use-tests";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Page() {
  const { tests, scrollNext, isTestLoading, getTestError } = useTests({
    pageSize: 15,
  });
  const { inView, ref } = useInView();

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  if (!isTestLoading && getTestError) {
    return (
      <MainLayout>
        <ErrorCard
          title="Failed to load tests"
          message="We couldn't retrieve your tests. Please try again later."
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-3">
              <H3>Library</H3>
            </div>
            <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
              <Button variant={"outline"}>
                <RelativeLink href={"builder"}>Create Test</RelativeLink>
              </Button>
            </RoleBaseComponent>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {tests.map((item) => (
              <TestCard key={item.id} {...item} />
            ))}
            {tests.length === 0 && (
              <div className="col-span-full">
                There are no tests available in the library.
              </div>
            )}
            <div ref={ref} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
