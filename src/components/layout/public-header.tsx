"use client";

import React from "react";
import { Button, Tag, Tooltip, message, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  ShareAltOutlined,
  UserOutlined,
  DashboardOutlined,
  DownOutlined,
  BookOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/types/auth";

interface PublicHeaderProps {
  currentUser: SafeUser | null;
}

export default function PublicHeader({ currentUser }: PublicHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleShare = async () => {
    try {
      const shareUrl = window.location.origin;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        message.success("Đã sao chép liên kết chia sẻ! (Có ảnh xem trước và chuẩn SEO)");
      } else {
        message.info(`Liên kết: ${shareUrl}`);
      }
    } catch {
      message.error("Không thể sao chép liên kết");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    message.info("Đã đăng xuất thành công");
    router.push("/");
    router.refresh();
  };

  // Menu Dropdown 4 môn học
  const subjectsMenu: MenuProps["items"] = [
    {
      key: "ltwnc",
      label: (
        <Link href="/subjects/ltwnc" className="py-0.5 block">
          <div className="font-semibold text-slate-800 text-xs">INT1450 - Lập trình Web Nâng Cao</div>
          <div className="text-[11px] text-slate-400">TS. Hoàng Quốc Hưng • Phòng 302-A2</div>
        </Link>
      ),
    },
    {
      key: "attt",
      label: (
        <Link href="/subjects/attt" className="py-0.5 block">
          <div className="font-semibold text-slate-800 text-xs">INT1415 - An Toàn Thông Tin</div>
          <div className="text-[11px] text-slate-400">ThS. Vũ Thị Mai Anh • Phòng 405-A3</div>
        </Link>
      ),
    },
    {
      key: "ktpm",
      label: (
        <Link href="/subjects/ktpm" className="py-0.5 block">
          <div className="font-semibold text-slate-800 text-xs">INT1442 - Kiến Trúc Phần Mềm</div>
          <div className="text-[11px] text-slate-400">PGS.TS. Đỗ Thanh Hùng • Phòng 201-A2</div>
        </Link>
      ),
    },
    {
      key: "ttnt",
      label: (
        <Link href="/subjects/ttnt" className="py-0.5 block">
          <div className="font-semibold text-slate-800 text-xs">INT1434 - Trí Tuệ Nhân Tạo</div>
          <div className="text-[11px] text-slate-400">TS. Phạm Minh Tuấn • Phòng 504-A3</div>
        </Link>
      ),
    },
  ];

  // Menu Dropdown tài khoản người dùng
  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div className="py-1 px-1">
          <div className="font-bold text-slate-900 text-sm">{currentUser?.name}</div>
          <div className="text-xs text-slate-400">{currentUser?.email}</div>
          <div className="mt-1.5">
            <Tag
              className={`m-0 text-[10px] font-bold px-2 py-0 rounded ${
                currentUser?.role === "admin"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {currentUser?.role === "admin" ? "Lớp trưởng (Admin)" : "Sinh viên PTIT"}
            </Tag>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    ...(currentUser?.role === "admin"
      ? [
          {
            key: "admin-dashboard",
            icon: <DashboardOutlined />,
            label: (
              <Link href="/admin" className="font-medium">
                Trang Quản Trị Lớp Học
              </Link>
            ),
          },
        ]
      : []),
    {
      key: "all-deadlines",
      icon: <BookOutlined />,
      label: <Link href="/deadlines">Xem tất cả Deadline</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Đăng xuất tài khoản",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Bên trái: Logo PTIT & Thanh điều hướng */}
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Trang chủ Class Deadline Hub PTIT" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.svg"
              alt="Logo PTIT"
              width={36}
              height={36}
              priority
              className="rounded-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg group-hover:text-[#c8102e] transition-colors">
                  Class Deadline Hub
                </span>
              
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Cổng thông tin hạn nộp bài tập sinh viên
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/"
                  ? "text-[#c8102e] font-bold bg-red-50/60"
                  : "text-slate-600 hover:text-[#c8102e] hover:bg-slate-50"
              }`}
            >
              Trang chủ
            </Link>

            <Link
              href="/deadlines"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/deadlines")
                  ? "text-[#c8102e] font-bold bg-red-50/60"
                  : "text-slate-600 hover:text-[#c8102e] hover:bg-slate-50"
              }`}
            >
              Tất cả Deadline
            </Link>

            <Dropdown menu={{ items: subjectsMenu }} placement="bottomLeft">
              <button
                type="button"
                aria-label="Danh mục môn học chuyên ngành"
                aria-haspopup="true"
                className={`px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith("/subjects")
                    ? "text-[#c8102e] font-bold bg-red-50/60"
                    : "text-slate-600 hover:text-[#c8102e] hover:bg-slate-50"
                }`}
              >
                <span>Môn học</span>
                <DownOutlined className="text-[9px]" />
              </button>
            </Dropdown>
          </nav>
        </div>

        {/* Bên phải: Nút Chia sẻ & Hồ sơ Người dùng */}
        <div className="flex items-center gap-2.5">
          <Tooltip title="Sao chép link chia sẻ cổng thông tin">
            <Button
              icon={<ShareAltOutlined />}
              onClick={handleShare}
              aria-label="Sao chép link chia sẻ cổng thông tin"
              className="border-slate-200 hover:border-[#c8102e] hover:text-[#c8102e] text-slate-700 text-xs"
            >
              <span className="hidden md:inline">Chia sẻ link</span>
            </Button>
          </Tooltip>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Nút vào Bảng Quản trị CHỈ dành riêng cho Lớp Trưởng (Admin) */}
              {currentUser.role === "admin" && (
                <Link href="/admin">
                  <Button
                    type="primary"
                    icon={<DashboardOutlined />}
                    className="bg-[#c8102e] hover:bg-[#b00e28] font-medium shadow-2xs text-xs"
                  >
                    <span className="hidden sm:inline">Quản Trị Admin</span>
                  </Button>
                </Link>
              )}

              {/* User Dropdown tinh tế */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all select-none">
                  <Avatar
                    src={currentUser.image}
                    style={{ backgroundColor: currentUser.role === "admin" ? "#c8102e" : "#475569" }}
                    icon={!currentUser.image ? <UserOutlined /> : undefined}
                    size="small"
                  >
                    {!currentUser.image && (currentUser.role === "admin" ? "AD" : "SV")}
                  </Avatar>
                  <div className="hidden md:flex flex-col text-left pr-1 leading-tight">
                    <span className="text-xs font-bold text-slate-800 max-w-[140px] truncate">
                      {currentUser.name.split("(")[0].trim()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {currentUser.role === "admin" ? "Lớp Trưởng" : "Sinh Viên"}
                    </span>
                  </div>
                  <DownOutlined className="text-[9px] text-slate-400 pr-1" />
                </div>
              </Dropdown>

              {/* Nút Đăng xuất trực tiếp trên Header */}
              <Tooltip title="Đăng xuất khỏi hệ thống">
                <Button
                  size="small"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className="hidden sm:inline-flex font-medium text-xs border-red-200 hover:bg-red-50"
                >
                  Đăng xuất
                </Button>
              </Tooltip>
            </div>
          ) : (
            <Link href="/login">
              <Button
                type="primary"
                icon={<LoginOutlined />}
                className="bg-[#c8102e] hover:bg-[#b00e28] font-semibold text-xs shadow-2xs"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
