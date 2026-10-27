import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Đăng Nhập Hệ Thống | Class Deadline Hub PTIT",
  description: "Trang đăng nhập dành cho Lớp trưởng và Sinh viên PTIT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
