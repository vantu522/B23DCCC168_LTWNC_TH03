"use client";

import React, { useState, useMemo } from "react";
import { Row, Col, Table, Tag, Space, Tooltip, Popconfirm, Empty, message, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ClockCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";
import { Deadline, Subject } from "@/types/deadline";
import { SafeUser } from "@/types/auth";
import DeadlineCard from "./deadline-card";
import Countdown from "./countdown";
import CompletionButton from "./completion-button";
import DeadlineFilter, { FilterState } from "./deadline-filter";
import { deleteDeadlineAction } from "@/features/deadlines/deadline.actions";

interface DeadlineListProps {
  deadlines: Deadline[];
  subjects: Subject[];
  completedList: string[];
  currentUser: SafeUser | null;
  viewMode?: "grid" | "table";
  showFilter?: boolean;
}

export default function DeadlineList({
  deadlines: initialDeadlines,
  subjects,
  completedList: initialCompleted,
  currentUser,
  viewMode: defaultViewMode = "grid",
  showFilter = true,
}: DeadlineListProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [completedList, setCompletedList] = useState<string[]>(initialCompleted);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    subjectId: "all",
    type: "all",
    status: "all",
    sortBy: "dueAsc",
    viewMode: defaultViewMode,
  });

  const getSubject = (sId: string) => subjects.find((s) => s.id === sId);
  const isAdmin = currentUser?.role === "admin";

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const filtered = useMemo(() => {
    const now = dayjs();
    return deadlines
      .filter((d) => {
        if (filters.search.trim()) {
          const kw = filters.search.toLowerCase().trim();
          const matchTitle = d.title.toLowerCase().includes(kw);
          const matchDesc = d.description?.toLowerCase().includes(kw);
          if (!matchTitle && !matchDesc) return false;
        }

        if (filters.subjectId !== "all" && d.subjectId !== filters.subjectId) {
          return false;
        }

        if (filters.type !== "all" && d.type !== filters.type) {
          return false;
        }

        const isDone = completedList.includes(d.id);
        const isOverdue = dayjs(d.dueDate).isBefore(now);
        const isUrgent = !isOverdue && dayjs(d.dueDate).diff(now, "day") <= 3;

        if (filters.status === "completed") return isDone;
        if (filters.status === "pending") return !isDone;
        if (filters.status === "overdue") return isOverdue;
        if (filters.status === "urgent") return isUrgent;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "dueAsc") {
          return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
        }
        if (filters.sortBy === "dueDesc") {
          return dayjs(b.dueDate).valueOf() - dayjs(a.dueDate).valueOf();
        }
        if (filters.sortBy === "priority") {
          const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        }
        return 0;
      });
  }, [deadlines, filters, completedList]);

  const handleDelete = async (id: string) => {
    const res = await deleteDeadlineAction(id);
    if (res.success) {
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
      setCompletedList((prev) => prev.filter((cId) => cId !== id));
      message.success("Đã xoá deadline thành công!");
    } else {
      message.error(res.error || "Không thể xoá");
    }
  };

  const handleCompletionChanged = (id: string, isDone: boolean) => {
    setCompletedList((prev) =>
      isDone ? [...prev, id] : prev.filter((cId) => cId !== id)
    );
  };

  const columns: ColumnsType<Deadline> = [
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      render: (_, r) => (
        <CompletionButton
          deadlineId={r.id}
          isCompleted={completedList.includes(r.id)}
          canMark={!!currentUser}
          onSuccess={(newStatus) => handleCompletionChanged(r.id, newStatus)}
        />
      ),
    },
    {
      title: "Tiêu đề & Nội dung",
      key: "title",
      render: (_, r) => {
        const isCompleted = completedList.includes(r.id);
        return (
          <div className="max-w-md">
            <Link href={`/deadlines/${r.id}`}>
              <div
                className={`font-semibold cursor-pointer hover:text-[#c8102e] ${
                  isCompleted ? "line-through text-slate-400" : "text-slate-800"
                }`}
              >
                {r.title}
              </div>
            </Link>
            {r.description && (
              <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {r.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Môn học",
      key: "subject",
      width: 170,
      render: (_, r) => {
        const s = getSubject(r.subjectId);
        return (
          <Tag className="font-medium bg-slate-100 text-slate-700 border-slate-200">
            {s ? s.name : r.subjectId}
          </Tag>
        );
      },
    },
    {
      title: "Hạn chót & Đếm ngược",
      key: "dueDate",
      width: 190,
      sorter: (a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf(),
      render: (_, r) => (
        <div>
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
            <ClockCircleOutlined className="text-slate-400" />
            <span>{dayjs(r.dueDate).format("HH:mm - DD/MM")}</span>
          </div>
          <Countdown dueDate={r.dueDate} />
        </div>
      ),
    },
    {
      title: "Phân loại",
      key: "type",
      width: 130,
      render: (_, r) => (
        <Space direction="vertical" size={2}>
          <Tag className="bg-slate-100 text-slate-600 border-slate-200 m-0">{r.type}</Tag>
          {r.priority === "high" && (
            <Tag className="bg-red-50 text-red-600 border-red-200 m-0 font-medium">Gấp</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, r) => (
        <Space size={6}>
          <Link href={`/deadlines/${r.id}`}>
            <Button
              size="small"
              className="text-xs font-medium text-slate-700 border-slate-300 hover:text-[#c8102e] hover:border-[#c8102e] px-2.5 rounded-md"
            >
              Xem bài
            </Button>
          </Link>

          {isAdmin && (
            <Popconfirm
              title="Xoá deadline?"
              okText="Xoá"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(r.id)}
            >
              <Tooltip title="Xoá">
                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {showFilter && (
        <DeadlineFilter
          subjects={subjects}
          filters={filters}
          onChange={handleFilterChange}
          totalCount={deadlines.length}
          filteredCount={filtered.length}
          hasUser={!!currentUser}
        />
      )}

      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center">
          <Empty description="Không có deadline nào phù hợp với bộ lọc." />
        </div>
      ) : filters.viewMode === "grid" ? (
        <Row gutter={[16, 16]}>
          {filtered.map((dl) => (
            <Col xs={24} sm={12} lg={8} key={dl.id}>
              <DeadlineCard
                deadline={dl}
                subject={getSubject(dl.subjectId)}
                isCompleted={completedList.includes(dl.id)}
                currentUser={currentUser}
                onDeleted={(id) => setDeadlines((prev) => prev.filter((d) => d.id !== id))}
                onCompletionChanged={handleCompletionChanged}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 8 }}
            size="middle"
            scroll={{ x: 800 }}
          />
        </div>
      )}
    </div>
  );
}
