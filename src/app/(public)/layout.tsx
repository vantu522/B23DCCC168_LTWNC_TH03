import React from "react";
import { getCurrentUser } from "@/lib/auth";
import PublicHeader from "@/components/layout/public-header";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fb]">
      <PublicHeader currentUser={currentUser} />
      <div className="flex-1 flex flex-col">{children}</div>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <div className="font-semibold text-slate-700">
            Học viện Công nghệ Bưu chính Viễn thông • Class Deadline Hub
          </div>
          <p className="text-slate-600 text-xs">
            Cổng thông tin theo dõi và quản lý hạn chót bài tập sinh viên trực tuyến.
          </p>
        </div>
      </footer>
    </div>
  );
}
