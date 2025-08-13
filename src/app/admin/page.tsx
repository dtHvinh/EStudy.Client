"use client";

import { Shield, Users } from "lucide-react";

import ContentModeration from "@/components/admin/content-moderation/content-moderation";
import ApplicationStatistic from "@/components/admin/statistic/ApplicationStatistic";
import UserManagement from "@/components/admin/user-management/user-management";
import MainLayout from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconChartArcs } from "@tabler/icons-react";

export default function AdminModerationPage() {
  return (
    <MainLayout>
      <main className="mx-auto w-6xl">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Content Reports
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center">
              <IconChartArcs className="mr-2 h-4 w-4" />
              Statistic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="statistics">
            <ApplicationStatistic />
          </TabsContent>
        </Tabs>
      </main>
    </MainLayout>
  );
}
