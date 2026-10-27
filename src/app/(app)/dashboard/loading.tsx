"use client";

import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function DashboardLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "#c8102e" }} spin />} />
      <span className="text-xs text-slate-500 mt-3 font-medium">Đang tải Dashboard...</span>
    </div>
  );
}
