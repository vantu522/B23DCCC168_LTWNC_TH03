"use client";

import React from "react";
import { Button, Result } from "antd";
import Link from "next/link";
import { HomeOutlined, LoginOutlined } from "@ant-design/icons";

export default function ForbiddenPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <Result
          status="403"
          title="403"
          subTitle="Bạn không có quyền truy cập vào khu vực này. Trang này chỉ dành riêng cho Lớp trưởng (Admin)."
          extra={[
            <Link key="home" href="/">
              <Button type="primary" icon={<HomeOutlined />} className="bg-[#c8102e] hover:bg-[#b00e28] font-medium">
                Về Trang Chủ Sinh Viên
              </Button>
            </Link>,
            <Link key="login" href="/login">
              <Button icon={<LoginOutlined />}>
                Đổi tài khoản Admin
              </Button>
            </Link>,
          ]}
        />
      </div>
    </div>
  );
}
