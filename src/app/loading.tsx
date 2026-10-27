"use client";

import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="p-6 bg-white/80 rounded-2xl shadow-xs border border-slate-200/80 backdrop-blur flex flex-col items-center gap-4">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 40, color: "#c8102e" }} spin />
          }
        />
        <div className="text-center">
          <div className="text-sm font-bold text-slate-800">Đang tải dữ liệu PTIT...</div>
          <div className="text-xs text-slate-400">Vui lòng chờ trong giây lát</div>
        </div>
      </div>
    </div>
  );
}
