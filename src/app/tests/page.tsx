"use client";

import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import RoleBaseComponent from "@/components/role-base-component";
import TestCard from "@/components/test-card";
import H3 from "@/components/ui/h3";
import useTests from "@/hooks/use-tests";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CreateTestButton } from "@/components/create-test-button";

export default function Page() {
  const { tests, scrollNext, isTestLoading, getTestError, refresh } = useTests({
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
            <H3>Tests</H3>
            <div className="flex items-center gap-2">
              <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
                <CreateTestButton />
              </RoleBaseComponent>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {tests.map((item) => (
                <TestCard onTestDeleted={refresh} key={item.id} {...item} />
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
      </div>
    </MainLayout>
  );
}
