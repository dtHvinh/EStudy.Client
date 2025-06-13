"use client";

import {
  IconBallpen,
  IconBrandParsinta,
  IconCalendarEventFilled,
  IconDashboard,
  IconScript,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser, NavUserSkeleton } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserInfo } from "@/hooks/use-user-info";
import Image from "next/image";
import Link from "next/link";
import DataErrorAlert from "./data-error-alert";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    // avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "My information",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Flash cards",
      url: "fc",
      icon: IconScript,
    },
    {
      title: "Courses",
      url: "courses",
      icon: IconBrandParsinta,
    },
    {
      title: "Schedule",
      url: "schedule",
      icon: IconCalendarEventFilled,
    },
    {
      title: "Do Test",
      url: "tests",
      icon: IconBallpen,
    },
  ],
  navSecondary: [],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, getUserError, isUserLoading, reload } = useUserInfo();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="dashboard">
                <div className="relative size-28 py-2">
                  <Image src="/logo2.png" fill alt="Logo" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {isUserLoading ? (
          <NavUserSkeleton />
        ) : getUserError ? (
          <DataErrorAlert
            onReload={reload}
            title="Failed to load user."
            description="Please contact support or try again."
          />
        ) : (
          user && <NavUser user={user} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
