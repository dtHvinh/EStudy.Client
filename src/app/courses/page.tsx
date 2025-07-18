"use client";

import InstructorPage from "@/components/course/instructor-page";
import StudentPage from "@/components/course/student-page";
import MainLayout from "@/components/layouts/MainLayout";
import OnboardingBanner from "@/components/onboarding-banner";
import RoleBaseComponent from "@/components/role-base-component";
import { useUserInfo } from "@/hooks/use-user-info";

export default function Page() {
  const { user } = useUserInfo();
  return (
    <MainLayout>
      <RoleBaseComponent requireRoles={["Admin", "Instructor"]}>
        <InstructorPage />
      </RoleBaseComponent>
      <RoleBaseComponent requireRoles={["Student"]}>
        <StudentPage />
      </RoleBaseComponent>
      {user && !user.isOnBoarded && <OnboardingBanner />}
    </MainLayout>
  );
}
