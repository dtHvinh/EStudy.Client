"use client";

import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { AppSidebar } from "../app-sidebar";
import { AddCardProvider } from "../contexts/AddCardContext";
import FloatingToolboxProvider from "../contexts/FloatingToolboxContext";
import { ReportFormContextProvider } from "../contexts/ReportFormContext";
import { SiteHeader } from "../site-header";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function MainLayout({
  children,
  siteHeader,
  childDefaultPadding = true,
  noHeader = false,
}: Readonly<{
  children: React.ReactNode | React.ReactNode[];
  siteHeader?: React.ReactNode | React.ReactNode[];
  childDefaultPadding?: boolean;
  noHeader?: boolean;
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
      <ReportFormContextProvider>
        <AddCardProvider>
          <FloatingToolboxProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
              {!noHeader && <SiteHeader />}
              {siteHeader}
              <div className="flex min-h-[calc(100vh_-_var(--header-height))] flex-col">
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div
                      className={cn(
                        "flex flex-col gap-4 md:gap-6",
                        childDefaultPadding && "pt-4 md:pt-6",
                      )}
                    >
                      {children}
                    </div>
                  </div>
                </div>
              </div>
              {/* <SiteFooter /> */}
            </SidebarInset>
          </FloatingToolboxProvider>
        </AddCardProvider>
      </ReportFormContextProvider>
    </SidebarProvider>
  );
}
