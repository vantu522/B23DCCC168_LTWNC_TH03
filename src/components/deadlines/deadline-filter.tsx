"use client";

import React from "react";
import { Card, Input, Select, Segmented } from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Subject } from "@/types/deadline";

export interface FilterState {
  search: string;
  subjectId: string;
  type: string;
  status: string;
  sortBy: string;
  viewMode: "grid" | "table";
}

interface DeadlineFilterProps {
  subjects: Subject[];
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  totalCount: number;
  filteredCount: number;
  hasUser: boolean;
}

export default function DeadlineFilter({
  subjects,
  filters,
  onChange,
  filteredCount,
  hasUser,
}: DeadlineFilterProps) {
  return (
    <Card className="border-slate-200 shadow-xs rounded-xl" styles={{ body: { padding: "16px" } }}>
      <div className="flex flex-col gap-4">
        {/* Row 1: Search, Subject, Type, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Tìm theo tiêu đề, yêu cầu..."
            aria-label="Tìm kiếm bài tập và deadline"
            prefix={<SearchOutlined className="text-slate-400" />}
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            allowClear
          />

          <Select
            value={filters.subjectId}
            aria-label="Lọc theo môn học"
            onChange={(val) => onChange({ subjectId: val })}
            options={[
              { value: "all", label: "Tất cả 4 môn học" },
              ...subjects.map((s) => ({
                value: s.id,
                label: `${s.code} - ${s.name}`,
              })),
            ]}
          />

          <Select
            value={filters.type}
            aria-label="Lọc theo thể loại bài tập"
            onChange={(val) => onChange({ type: val })}
            options={[
              { value: "all", label: "Tất cả thể loại" },
              { value: "Thực hành", label: "Thực hành" },
              { value: "Bài tập lớn", label: "Bài tập lớn" },
              { value: "Bài tập", label: "Bài tập" },
              { value: "Tiểu luận", label: "Tiểu luận" },
              { value: "Kiểm tra", label: "Kiểm tra" },
            ]}
          />

          <Select
            value={filters.sortBy}
            aria-label="Sắp xếp danh sách bài tập"
            onChange={(val) => onChange({ sortBy: val })}
            options={[
              { value: "dueAsc", label: "Hạn chót: Gần nhất trước" },
              { value: "dueDesc", label: "Hạn chót: Xa nhất trước" },
              { value: "priority", label: "Mức ưu tiên: Gấp nhất trước" },
            ]}
          />
        </div>

        {/* Row 2: Status tabs & Grid/Table switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Trạng thái:
            </span>
            <Segmented
              aria-label="Lọc theo trạng thái hoàn thành"
              value={filters.status}
              onChange={(val) => onChange({ status: val.toString() })}
              options={[
                { label: "Tất cả", value: "all" },
                {
                  label: (
                    <span className="flex items-center gap-1 text-red-600">
                      <FireOutlined /> Gấp (≤ 3 ngày)
                    </span>
                  ),
                  value: "urgent",
                },
                {
                  label: (
                    <span className="flex items-center gap-1">
                      <ClockCircleOutlined /> Quá hạn
                    </span>
                  ),
                  value: "overdue",
                },
                ...(hasUser
                  ? [
                      { label: "Chưa xong", value: "pending" },
                      { label: "Đã hoàn thành", value: "completed" },
                    ]
                  : []),
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Hiển thị <strong>{filteredCount}</strong> deadline
            </span>

            <Segmented
              value={filters.viewMode}
              onChange={(val) => onChange({ viewMode: val as "grid" | "table" })}
              options={[
                { value: "grid", icon: <AppstoreOutlined title="Dạng thẻ" /> },
                { value: "table", icon: <BarsOutlined title="Dạng bảng" /> },
              ]}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
