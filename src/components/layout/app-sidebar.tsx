"use client";

import React, { createContext, useContext, useState } from "react";
import { Layout, Menu, Tag, Badge } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

interface SidebarContextType {
  collapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleCollapse: () => {},
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapse: () => setCollapsed((prev) => !prev),
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

interface AppSidebarProps {
  collapsed?: boolean;
  urgentCount?: number;
}

export default function AppSidebar({
  collapsed: externalCollapsed,
  urgentCount = 0,
}: AppSidebarProps) {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : sidebar.collapsed;

  // Highlight menu theo pathname
  let selectedKey = "/dashboard";
  if (pathname.startsWith("/admin")) {
    selectedKey = "/admin";
  } else if (pathname.startsWith("/dashboard/deadlines")) {
    selectedKey = "/dashboard/deadlines";
  } else if (pathname.startsWith("/dashboard")) {
    selectedKey = "/dashboard";
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Tổng quan Dashboard</Link>,
    },
    {
      key: "/admin",
      icon: <SafetyCertificateOutlined />,
      label: (
        <div className="flex items-center justify-between pr-2">
          <Link href="/admin">Quản trị Admin</Link>
          {urgentCount > 0 && (
            <Badge
              count={urgentCount}
              overflowCount={99}
              style={{ backgroundColor: "#ef4444" }}
            />
          )}
        </div>
      ),
    },
    {
      key: "/deadlines",
      icon: <CalendarOutlined />,
      label: <Link href="/deadlines">Xem Tất cả Deadline</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "public-portal",
      icon: <GlobalOutlined />,
      label: (
        <Link href="/" className="text-slate-600 hover:text-[#c8102e]">
          Cổng Công Khai
        </Link>
      ),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={isCollapsed}
      trigger={null}
      width={250}
      theme="light"
      className="border-r border-slate-200 shadow-xs select-none sticky top-0 h-screen overflow-y-auto"
      style={{ background: "#ffffff" }}
    >
      <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-100 overflow-hidden">
        <Image
          src="/images/logo.svg"
          alt="Logo PTIT"
          width={36}
          height={36}
          priority
          className="rounded-xl shadow-xs shrink-0"
        />
        {!isCollapsed && (
          <div className="flex flex-col truncate">
            <span className="font-extrabold text-slate-800 text-sm tracking-tight truncate flex items-center gap-1.5">
              <span>Admin Hub</span>
              <Tag color="red" className="m-0 text-[10px] font-bold px-1 py-0">
                Lớp trưởng
              </Tag>
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              Quản trị deadline
            </span>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="border-r-0 mt-2 font-medium text-slate-600"
        style={{ background: "transparent" }}
      />
    </Sider>
  );
}
