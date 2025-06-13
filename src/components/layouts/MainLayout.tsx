import React from "react";
import { AppSidebar } from "../app-sidebar";
import { AuthProvider } from "../contexts/AuthContext";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export default function MainLayout({
  children,
  siteHeader,
}: Readonly<{
  children: React.ReactNode | React.ReactNode[];
  siteHeader?: React.ReactNode | React.ReactNode[];
}>) {
  return (
    <AuthProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          {siteHeader}
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
