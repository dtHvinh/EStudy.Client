"use client";

import { CourseBuilder } from "@/components/course-builder/course-builder";
import MainLayout from "@/components/layouts/MainLayout";
import RoleBaseComponent from "@/components/role-base-component";

export default function Home() {
  return (
    <RoleBaseComponent requireRoles={["Admin", "Instructor"]}>
      <MainLayout>
        <CourseBuilder />
      </MainLayout>
    </RoleBaseComponent>
  );
}
