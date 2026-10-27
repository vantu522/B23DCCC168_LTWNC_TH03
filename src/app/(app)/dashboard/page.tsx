import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";
import Countdown from "@/components/deadlines/countdown";
import Link from "next/link";
import dayjs from "dayjs";

export const metadata = {
  title: "Tổng Quan Dashboard | PTIT",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const [currentUser, deadlines, subjects] = await Promise.all([
    getCurrentUser(),
    DeadlineService.getAllDeadlines(),
    SubjectService.getAllSubjects(),
  ]);

  let completedIds: string[] = [];
  if (currentUser) {
    completedIds = await DeadlineService.getUserProgress(currentUser.email);
  }

  const now = dayjs();
  let urgentCount = 0;
  let overdueCount = 0;
  const urgentList: typeof deadlines = [];

  deadlines.forEach((d) => {
    const due = dayjs(d.dueDate);
    if (due.isBefore(now)) overdueCount++;
    else if (due.diff(now, "day") <= 3) {
      urgentCount++;
      urgentList.push(d);
    }
  });

  const completedCount = completedIds.length;
  const total = deadlines.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const getSubject = (sId: string) => subjects.find((s) => s.id === sId);

  return (
    <div className="space-y-6">
      {/* User Welcome Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
              Xin chào, {currentUser?.name}!
            </h1>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                currentUser?.role === "admin"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {currentUser?.role === "admin" ? "Lớp Trưởng (Admin)" : "Sinh Viên"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 m-0">
            Học viện Công nghệ Bưu chính Viễn thông • Cổng Quản Lý Hạn Chót Bài Tập
          </p>
        </div>

        {currentUser?.role === "admin" && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c8102e] hover:bg-[#b00e28] text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
          >
            Vào Bảng Quản Trị Admin
          </Link>
        )}
      </div>

      {/* Student Progress */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-800 text-sm">
            Tiến độ hoàn thành bài tập của bạn: {completedCount}/{total} bài ({percent}%)
          </span>
          <span className="text-slate-400">Dữ liệu lưu tại db.json</span>
        </div>

        {/* Progress bar HTML thuần */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Stats Cards (Đã bỏ toàn bộ icon/emoji, chuẩn hóa 3 màu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">
            Tổng Deadline
          </span>
          <div className="text-3xl font-extrabold text-slate-800 flex items-baseline gap-1.5">
            <span>{total}</span>
            <span className="text-xs text-slate-400 font-normal">bài</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">
            Gấp (≤ 3 ngày)
          </span>
          <div className="text-3xl font-extrabold text-red-600 flex items-baseline gap-1.5">
            <span>{urgentCount}</span>
            <span className="text-xs text-slate-400 font-normal">bài</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">
            Đã quá hạn
          </span>
          <div className="text-3xl font-extrabold text-slate-700 flex items-baseline gap-1.5">
            <span>{overdueCount}</span>
            <span className="text-xs text-slate-400 font-normal">bài</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold uppercase block mb-1">
            Môn học
          </span>
          <div className="text-3xl font-extrabold text-slate-800 flex items-baseline gap-1.5">
            <span>{subjects.length}</span>
            <span className="text-xs text-slate-400 font-normal">môn</span>
          </div>
        </div>
      </div>

      {/* Urgent Deadlines Alert */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <span className="font-bold text-slate-800 text-sm">
            Deadline Cần Chú Ý Sớm
          </span>
          <Link href="/deadlines" className="text-xs text-slate-600 hover:text-[#c8102e] hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {urgentList.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 italic">
            Không có bài tập nào gấp trong 3 ngày tới!
          </div>
        ) : (
          <div className="space-y-3">
            {urgentList.slice(0, 4).map((d) => {
              const s = getSubject(d.subjectId);
              return (
                <div
                  key={d.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <Link href={`/deadlines/${d.id}`}>
                      <div className="font-semibold text-xs text-slate-800 hover:text-[#c8102e] truncate">
                        {d.title}
                      </div>
                    </Link>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {s?.code} • Hạn: {dayjs(d.dueDate).format("DD/MM HH:mm")}
                    </div>
                  </div>
                  <Countdown dueDate={d.dueDate} showIcon={false} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
