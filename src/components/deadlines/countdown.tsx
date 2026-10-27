"use client";

import React, { useMemo } from "react";
import { Tag } from "antd";
import { ClockCircleOutlined, FireOutlined } from "@ant-design/icons";
import { calculateCountdown } from "@/lib/utils";

interface CountdownProps {
  dueDate: string;
  showIcon?: boolean;
}

export default function Countdown({ dueDate, showIcon = true }: CountdownProps) {
  const info = useMemo(() => calculateCountdown(dueDate), [dueDate]);
  const isDanger = info.color === "error";

  return (
    <Tag
      icon={
        showIcon ? (
          isDanger ? (
            <FireOutlined className="text-red-500 animate-pulse" />
          ) : (
            <ClockCircleOutlined className="text-slate-400" />
          )
        ) : undefined
      }
      className={`m-0 font-medium px-2 py-0.5 text-xs rounded border ${
        isDanger
          ? "bg-red-50 text-red-600 border-red-200"
          : "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {info.text}
    </Tag>
  );
}
