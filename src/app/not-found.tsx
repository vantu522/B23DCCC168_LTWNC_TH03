"use client";

import React from "react";
import Link from "next/link";
import { Button, Result } from "antd";
import { HomeOutlined, DashboardOutlined } from "@ant-design/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <Result
          status="404"
          title="404"
          subTitle="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
          extra={
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link href="/">
                <Button type="primary" icon={<HomeOutlined />} className="bg-[#c8102e] hover:bg-[#b00e28]">
                  Về Trang Chủ
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button icon={<DashboardOutlined />}>Vào Dashboard</Button>
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}
