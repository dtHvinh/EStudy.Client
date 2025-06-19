"use client";

import {
  IconBallpen,
  IconBrandParsinta,
  IconDashboard,
  IconMessageChatbot,
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
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Flash card sets",
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
                  <Image
                    src="/logo2.png"
                    fill
                    alt="Logo"
                    className="dark:invert"
                  />
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
