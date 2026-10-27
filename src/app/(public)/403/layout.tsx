import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "403 - Không Có Quyền Truy Cập | PTIT",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
