"use client";

import React from "react";
import { Card, Tag, Button, Tooltip, Popconfirm, Space, message } from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  FireOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { Deadline, Subject } from "@/types/deadline";
import { SafeUser } from "@/types/auth";
import Countdown from "./countdown";
import CompletionButton from "./completion-button";
import { deleteDeadlineAction } from "@/features/deadlines/deadline.actions";

interface DeadlineCardProps {
  deadline: Deadline;
  subject?: Subject;
  isCompleted?: boolean;
  currentUser: SafeUser | null;
  onDeleted?: (id: string) => void;
  onCompletionChanged?: (id: string, completed: boolean) => void;
}

export default function DeadlineCard({
  deadline,
  subject,
  isCompleted = false,
  currentUser,
  onDeleted,
  onCompletionChanged,
}: DeadlineCardProps) {
  const due = dayjs(deadline.dueDate);
  const isAdmin = currentUser?.role === "admin";

  const handleDelete = async () => {
    const res = await deleteDeadlineAction(deadline.id);
    if (res.success) {
      message.success("Đã xoá deadline thành công!");
      onDeleted?.(deadline.id);
    } else {
      message.error(res.error || "Không thể xoá");
    }
  };

  return (
    <Card
      className={`relative flex flex-col justify-between border-slate-200 shadow-xs hover:shadow-md transition-all rounded-xl overflow-hidden ${
        isCompleted ? "bg-emerald-50/25 border-emerald-200" : "bg-white"
      }`}
      styles={{
        body: {
          padding: "16px 18px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Top Header: Môn học & Priority (Đồng bộ tối đa 3 màu: Slate, Đỏ PTIT, Xanh lá khi hoàn thành) */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <Link href={`/subjects/${subject?.slug || deadline.subjectId.toLowerCase()}`}>
          <Tag className="m-0 text-xs px-2.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 border-slate-200 cursor-pointer hover:bg-slate-200 hover:text-slate-900 transition-colors">
            {subject ? `${subject.code} - ${subject.name}` : deadline.subjectId}
          </Tag>
        </Link>

        <div className="flex items-center gap-1.5">
          {deadline.priority === "high" && (
            <Tooltip title="Mức độ ưu tiên cao">
              <Tag
                icon={<FireOutlined className="text-red-500" />}
                className="m-0 text-xs font-medium bg-red-50 text-red-600 border-red-200"
              >
                Gấp
              </Tag>
            </Tooltip>
          )}
          <Tag className="m-0 text-xs bg-slate-100 text-slate-600 border-slate-200">
            {deadline.type}
          </Tag>
        </div>
      </div>

      {/* Title */}
      <div className="mb-2">
        <Link href={`/deadlines/${deadline.id}`}>
          <h3
            className={`font-bold text-base line-clamp-2 transition-colors hover:text-[#c8102e] ${
              isCompleted ? "line-through text-slate-400" : "text-slate-800"
            }`}
            title={deadline.title}
          >
            {deadline.title}
          </h3>
        </Link>
      </div>

      {/* Description Snippet */}
      {deadline.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {deadline.description}
        </p>
      )}

      {/* Due Date & Countdown */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <ClockCircleOutlined className="text-slate-400" />
          <span>{due.format("HH:mm - DD/MM")}</span>
        </div>

        <Countdown dueDate={deadline.dueDate} />
      </div>

      {/* Target & Lecturer */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          <TeamOutlined className="mr-1" />
          {deadline.target || "Cá nhân"}
        </span>
        <span>{subject?.lecturer}</span>
      </div>

      {/* Actions footer */}
      <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
        <CompletionButton
          deadlineId={deadline.id}
          isCompleted={isCompleted}
          canMark={!!currentUser}
          onSuccess={(newStatus) => onCompletionChanged?.(deadline.id, newStatus)}
        />

        <Space size={6}>
          <Link href={`/deadlines/${deadline.id}`}>
            <Button
              size="small"
              className="text-xs font-medium text-slate-700 border-slate-300 hover:text-[#c8102e] hover:border-[#c8102e] px-2.5 rounded-md"
            >
              Xem bài
            </Button>
          </Link>

          {isAdmin && (
            <Popconfirm
              title="Xoá deadline này?"
              description="Bài tập sẽ bị xoá khỏi hệ thống công khai."
              okText="Xoá"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={handleDelete}
            >
              <Tooltip title="Xoá">
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      </div>
    </Card>
  );
}
