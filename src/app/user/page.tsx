"use client";

import { ProfileSkeleton } from "@/components/dashboard-skeleton";
import { ErrorCard } from "@/components/error-card";
import MainLayout from "@/components/layouts/MainLayout";
import useUserProfile from "@/hooks/use-user-profile";

export default function Page() {
  const { userProfile, isLoading, error } = useUserProfile({});

  if (isLoading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorCard message="Failed to load user profile" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        {userProfile && (
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold">Name:</dt>
              <dd>{userProfile.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">Username:</dt>
              <dd>{userProfile.userName}</dd>
            </div>
            <div>
              <dt className="font-semibold">Email:</dt>
              <dd>{userProfile.email}</dd>
            </div>
            {userProfile.phoneNumber && (
              <div>
                <dt className="font-semibold">Phone:</dt>
                <dd>{userProfile.phoneNumber}</dd>
              </div>
            )}
            {userProfile.bio && (
              <div>
                <dt className="font-semibold">Bio:</dt>
                <dd>{userProfile.bio}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </MainLayout>
  );
}
