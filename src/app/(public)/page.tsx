import React from "react";
import Link from "next/link";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";
import { getCurrentUser } from "@/lib/auth";
import DeadlineList from "@/components/deadlines/deadline-list";

export const metadata = {
  title: "Class Deadline Hub | Cổng Thông Tin Deadline PTIT",
  description: "Cổng tra cứu hạn nộp bài tập, thực hành và lịch thi công khai sinh viên PTIT.",
};

export default async function HomePage() {
  const [deadlines, subjects, currentUser] = await Promise.all([
    DeadlineService.getAllDeadlines(),
    SubjectService.getAllSubjects(),
    getCurrentUser(),
  ]);

  let completedIds: string[] = [];
  if (currentUser) {
    completedIds = await DeadlineService.getUserProgress(currentUser.email);
  }

  const stats = DeadlineService.calculateStats(deadlines, completedIds);

  return (
    <>
      {/* Hero Banner Clean Modern (Không dùng màu gradient, tông phẳng chuẩn PTIT) */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#c8102e] border border-red-200">
              <span className="w-2 h-2 rounded-full bg-[#c8102e] animate-pulse"></span>
              Cổng công khai • Học viện Công nghệ Bưu chính Viễn thông
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Class Deadline Hub PTIT
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Theo dõi hạn chót nộp bài tập, đề tài lớn, thực hành và lịch thi trực tuyến cho 4 môn học chuyên ngành.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center min-w-[95px]">
              <div className="text-2xl font-black text-slate-800">{stats.total}</div>
              <div className="text-[11px] text-slate-500 font-medium">Tổng Deadline</div>
            </div>
            <div className="bg-red-50/70 border border-red-200 p-3 rounded-xl text-center min-w-[95px]">
              <div className="text-2xl font-black text-red-600">{stats.urgentCount}</div>
              <div className="text-[11px] text-red-600 font-medium">Gấp (≤ 3 ngày)</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center min-w-[95px]">
              <div className="text-2xl font-black text-slate-700">{stats.overdueCount}</div>
              <div className="text-[11px] text-slate-500 font-medium">Đã quá hạn</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center min-w-[95px]">
              <div className="text-2xl font-black text-slate-800">{subjects.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">Môn học</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick subject shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {subjects.map((s) => {
            const count = deadlines.filter((d) => d.subjectId === s.id).length;
            return (
              <Link
                key={s.id}
                href={`/subjects/${s.slug}`}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#c8102e] hover:shadow-xs transition-all block group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase text-slate-800 group-hover:text-[#c8102e] transition-colors">
                    {s.code}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {count} bài
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 line-clamp-1">{s.name}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>{s.room}</span>
                  <span>{s.lecturer.split(" ").slice(-2).join(" ")}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Danh sách deadlines có kèm bộ lọc */}
        <DeadlineList
          deadlines={deadlines}
          subjects={subjects}
          completedList={completedIds}
          currentUser={currentUser}
          viewMode="grid"
          showFilter={true}
        />
      </main>
    </>
  );
}
