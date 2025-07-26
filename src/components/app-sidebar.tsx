"use client";

import {
  IconAffiliate,
  IconBallpen,
  IconBrandParsinta,
  IconDashboard,
  IconLayoutBoard,
  IconLibrary,
  IconMessageChatbot,
  IconReportSearch,
  IconScript,
} from "@tabler/icons-react";
import * as React from "react";

import { NavUser, NavUserSkeleton } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useUserInfo } from "@/hooks/use-user-info";
import Image from "next/image";
import Link from "next/link";
import DataErrorAlert from "./data-error-alert";
import NavMain from "./nav-main";
import NavAdmin from "./nav/nav-admin";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Blogs",
      url: "blogs",
      icon: IconReportSearch,
    },
    {
      title: "Flashcards",
      url: "sets",
      icon: IconScript,
    },
    {
      title: "Courses",
      url: "courses",
      icon: IconBrandParsinta,
    },
    {
      title: "AI",
      url: "ai",
      icon: IconMessageChatbot,
    },
    {
      title: "Tests",
      url: "tests",
      icon: IconBallpen,
    },
    {
      title: "Collections",
      url: "test-collections",
      icon: IconLibrary,
    },
    {
      title: "Playground",
      url: "playground",
      icon: IconLayoutBoard,
    },
  ],
  navSecondary: [],
  documents: [],
  adminNav: [
    {
      title: "Admin",
      url: "admin",
      icon: IconAffiliate,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, getUserError, isUserLoading, reload } = useUserInfo();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-between">
        <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
          <Link className="ml-14" href="/dashboard">
            <div className="relative size-28 py-2">
              <Image src="/logo2.png" fill alt="Logo" className="dark:invert" />
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <NavMain items={data.navMain} />
        <SidebarSeparator />
        <NavAdmin items={data.adminNav} />
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
