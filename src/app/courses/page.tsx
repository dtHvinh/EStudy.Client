"use client";

import InstructorPage from "@/components/course/instructor-page";
import StudentPage from "@/components/course/student-page";
import MainLayout from "@/components/layouts/MainLayout";
import RoleBaseComponent from "@/components/role-base-component";

export default function Page() {
  return (
    <MainLayout>
      <RoleBaseComponent requireRoles={["Admin", "Instructor"]}>
        <InstructorPage />
      </RoleBaseComponent>
      <RoleBaseComponent requireRoles={["Student"]}>
        <StudentPage />
      </RoleBaseComponent>
    </MainLayout>
  );
}
