"use client";

import React, { useState } from "react";
import { Button, Tooltip, message } from "antd";
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { toggleCompletionAction } from "@/features/deadlines/deadline.actions";

interface CompletionButtonProps {
  deadlineId: string;
  isCompleted: boolean;
  canMark: boolean;
  onSuccess?: (newStatus: boolean) => void;
}

export default function CompletionButton({
  deadlineId,
  isCompleted,
  canMark,
  onSuccess,
}: CompletionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!canMark) {
      message.warning("Vui lòng đăng nhập tài khoản sinh viên để đánh dấu bài tập!");
      return;
    }

    setLoading(true);
    try {
      const res = await toggleCompletionAction(deadlineId);
      if (res.success && res.data) {
        message.success(res.message);
        onSuccess?.(res.data.completed);
      } else {
        message.error(res.error || "Không thể cập nhật trạng thái");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  if (!canMark) {
    return (
      <Tooltip title="Đăng nhập để đánh dấu hoàn thành">
        <span className="text-[11px] text-slate-400 italic">Cần đăng nhập</span>
      </Tooltip>
    );
  }

  return (
    <Button
      size="small"
      loading={loading}
      type={isCompleted ? "primary" : "default"}
      icon={isCompleted ? <CheckCircleFilled /> : <CheckCircleOutlined />}
      onClick={handleToggle}
      className={
        isCompleted
          ? "bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          : "text-slate-600 hover:text-emerald-600 border-slate-300"
      }
    >
      {isCompleted ? "Đã xong" : "Đánh dấu xong"}
    </Button>
  );
}
