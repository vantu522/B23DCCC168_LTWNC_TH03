import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import AppSidebar, { SidebarProvider } from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";

export const metadata = {
  title: "Quản Trị Lớp Học | Class Deadline Hub PTIT",
};

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Toàn bộ khu vực app layout (admin dashboard) chỉ dành cho Lớp trưởng (Admin)
  if (currentUser.role !== "admin") {
    redirect("/403");
  }

  const deadlines = await DeadlineService.getAllDeadlines();
  const stats = DeadlineService.calculateStats(deadlines);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-[#f5f7fb]">
        {/* Sidebar quản trị */}
        <AppSidebar urgentCount={stats.urgentCount} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header quản trị */}
          <Header currentUser={currentUser} />

          {/* Nội dung trang Dashboard hoặc Admin */}
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
