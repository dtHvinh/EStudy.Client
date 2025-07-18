"use client";

import { ProfileSkeleton } from "@/components/dashboard-skeleton";
import DashboardNewestTests from "@/components/dashboard/dashboard-newest-tests";
import DashboardUserCreatedCourses from "@/components/dashboard/dashboard-user-created-crouse";
import DashboardUserData from "@/components/dashboard/dashboard-user-data";
import DashboardUserLearningCourses from "@/components/dashboard/dashboard-user-learning-courses";
import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import RoleBaseComponent from "@/components/role-base-component";
import { useUserInfo } from "@/hooks/use-user-info";

export default function Page() {
  const { user, isUserLoading, getUserError, reload } = useUserInfo();

  if (isUserLoading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    );
  }

  if (getUserError) {
    return (
      <MainLayout>
        <ErrorCard message="Something went wrong" onRetry={reload} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <DashboardUserData user={user} />

      <RoleBaseComponent requireRoles={["Student"]}>
        <DashboardUserLearningCourses />
      </RoleBaseComponent>
      <RoleBaseComponent requireRoles={["Instructor"]}>
        <DashboardUserCreatedCourses />
      </RoleBaseComponent>

      <DashboardNewestTests />
    </MainLayout>
  );
}
