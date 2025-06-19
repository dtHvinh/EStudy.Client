"use client";

import MainLayout from "@/components/layouts/MainLayout";
import RelativeLink from "@/components/relative-link";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/h3";

export default function Page() {
  return (
    <MainLayout>
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mx-4">
          <H3>My blogs</H3>
          <RelativeLink href="write">
            <Button variant={"outline"}>Create a blog</Button>
          </RelativeLink>
        </div>
      </div>
    </MainLayout>
  );
}
