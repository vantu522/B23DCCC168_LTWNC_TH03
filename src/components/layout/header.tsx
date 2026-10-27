"use client";

import React, { useState } from "react";
import { Layout, Button, Breadcrumb, Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  GlobalOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types/auth";
import DeadlineForm from "@/components/deadlines/deadline-form";
import { useSidebar } from "./app-sidebar";

const { Header: AntdHeader } = Layout;

interface HeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  currentUser: SafeUser | null;
}

export default function Header({
  collapsed: externalCollapsed,
  onToggleCollapse: externalOnToggle,
  currentUser,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const sidebar = useSidebar();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : sidebar.collapsed;
  const handleToggle = externalOnToggle || sidebar.toggleCollapse;

  let title = "Tổng Quan Lớp Học";
  if (pathname.startsWith("/admin")) title = "Trang Quản Trị Admin";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "info",
      label: (
        <div className="py-1">
          <div className="font-bold text-slate-800">{currentUser?.name || "Người dùng"}</div>
          <div className="text-xs text-slate-400">{currentUser?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "public",
      icon: <GlobalOutlined />,
      label: <Link href="/">Về Cổng Công Khai</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <AntdHeader className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggle}
            className="text-slate-600"
          />
          <Breadcrumb
            items={[
              { title: <Link href="/dashboard">Ứng dụng</Link> },
              { title: <span className="font-bold text-slate-800">{title}</span> },
            ]}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Nút Thêm Deadline nhanh cho Admin */}
          {currentUser?.role === "admin" && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#c8102e] hover:bg-[#b00e28] font-medium shadow-xs hidden sm:inline-flex"
            >
              Thêm Deadline
            </Button>
          )}

          <Link href="/">
            <Button icon={<GlobalOutlined />} className="hidden sm:inline-flex">
              Cổng Sinh Viên
            </Button>
          </Link>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <Avatar style={{ backgroundColor: "#c8102e" }} icon={<UserOutlined />}>
                AD
              </Avatar>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">
                  {currentUser?.name || "Lớp Trưởng"}
                </span>
                <span className="text-[10px] text-red-600 font-semibold uppercase">
                  {currentUser?.role === "admin" ? "Lớp Trưởng (Admin)" : "Sinh Viên"}
                </span>
              </div>
            </div>
          </Dropdown>

          <Button
            size="small"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="hidden sm:inline-flex font-medium text-xs border-red-200 hover:bg-red-50"
          >
            Đăng xuất
          </Button>
        </div>
      </AntdHeader>

      {/* Modal Thêm Deadline nếu là Admin */}
      {currentUser?.role === "admin" && (
        <DeadlineForm
          open={createModalOpen}
          subjects={[]}
          onCancel={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
