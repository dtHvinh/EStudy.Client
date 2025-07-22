"use client";

import { Shield, Users } from "lucide-react";

import ContentModeration from "@/components/admin/content-moderation/content-moderation";
import UserManagement from "@/components/admin/user-management";
import MainLayout from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminModerationPage() {
  return (
    <MainLayout>
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Content Moderation
              </h1>
              <p className="mt-1 text-gray-600">
                Manage reported content and user accounts
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-6xl">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Content Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </MainLayout>
  );
}
