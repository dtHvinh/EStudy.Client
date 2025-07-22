"use client";

import MainLayout from "@/components/layouts/MainLayout";
import Loading from "@/components/loading";
import NavigateBack from "@/components/navigate-back";
import RelativeLink from "@/components/relative-link";
import RoleBaseComponent from "@/components/role-base-component";
import H3 from "@/components/ui/h3";
import { Input } from "@/components/ui/input";
import useTestCollection from "@/hooks/use-test-collection";
import { ChangeEvent, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { CreateTestCollectionButton, TestCollectionCard } from "../page";

export default function Page() {
  const { collections, mutate, scrollNext, isLoading } = useTestCollection({
    pageSize: 25,
  });
  const { inView, ref } = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    500,
  );

  useEffect(() => {
    if (isLoading) {
      toast.message(<Loading text="Loading Collections" />, {
        id: "loading-collections",
      });
    } else {
      toast.dismiss("loading-collections");
    }
  }, [isLoading]);

  useEffect(() => {
    if (inView) {
      scrollNext();
    }
  }, [inView]);

  return (
    <MainLayout>
      <div className="space-y-4 px-4 lg:px-6">
        <div className="flex flex-col space-y-5">
          <div>
            <NavigateBack fallbackUrl="/tests" />
          </div>
          <div className="flex items-center justify-between">
            <H3>Your Collections</H3>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search..."
                onChange={debouncedSearch}
              />
              <RoleBaseComponent requireRoles={["Instructor", "Admin"]}>
                <CreateTestCollectionButton onCollectionCreated={mutate} />
              </RoleBaseComponent>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {collections.map((collection) => (
                <RelativeLink href={`${collection.id}`} key={collection.id}>
                  <TestCollectionCard {...collection} />
                </RelativeLink>
              ))}
              <div ref={ref} />
              {!isLoading && collections.length === 0 && (
                <div className="col-span-full">
                  There are no test collections available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
