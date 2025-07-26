"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import RoleBaseComponent from "../role-base-component";
import { isSelectedNav } from "../utils/utilss";

const NavAdmin = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) => {
  const path = usePathname();

  return (
    <RoleBaseComponent requireRoles={["Admin"]}>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className={`${isSelectedNav(path, item.url)}`}
                  tooltip={item.title}
                >
                  <Link
                    href={"/" + item.url}
                    className="flex items-center gap-2"
                  >
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </RoleBaseComponent>
  );
};

export default memo(NavAdmin);
