"use client";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { AppSidebar } from "../app-sidebar";
import FloatingToolboxProvider from "../contexts/FloatingToolboxContext";
import { SiteHeader } from "../site-header";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function MainLayout({
  children,
  siteHeader,
}: Readonly<{
  children: React.ReactNode | React.ReactNode[];
  siteHeader?: React.ReactNode | React.ReactNode[];
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <FloatingToolboxProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          {siteHeader || <SiteHeader />}
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 pt-4 md:gap-6 md:pt-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </FloatingToolboxProvider>
    </SidebarProvider>
  );
}
