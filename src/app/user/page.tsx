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
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Name:</label>
              <p>{userProfile.name}</p>
            </div>
            <div>
              <label className="font-semibold">Username:</label>
              <p>{userProfile.userName}</p>
            </div>
            <div>
              <label className="font-semibold">Email:</label>
              <p>{userProfile.email}</p>
            </div>
            {userProfile.phoneNumber && (
              <div>
                <label className="font-semibold">Phone:</label>
                <p>{userProfile.phoneNumber}</p>
              </div>
            )}
            {userProfile.bio && (
              <div>
                <label className="font-semibold">Bio:</label>
                <p>{userProfile.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
