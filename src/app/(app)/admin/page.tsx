import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";
import DeadlineList from "@/components/deadlines/deadline-list";

export const metadata = {
  title: "Quản Trị Lớp Trưởng (Admin) | PTIT",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  // Tự kiểm tra đăng nhập độc lập phía server
  if (!currentUser) {
    redirect("/login?callbackUrl=/admin");
  }

  // Tự kiểm tra quyền Admin độc lập phía server bằng ma trận phân quyền can(role, action)
  if (!can(currentUser.role, "Thêm deadline")) {
    redirect("/403");
  }

  const [deadlines, subjects, progressMap] = await Promise.all([
    DeadlineService.getAllDeadlines(),
    SubjectService.getAllSubjects(),
    DeadlineService.getAllProgress(),
  ]);

  return (
    <div className="space-y-6">
      {/* Admin Title Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 m-0">
              Khu Vực Quản Trị Lớp Trưởng
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 m-0">
            Toàn quyền thêm mới hoặc xóa bỏ các bài tập, hạn nộp công khai của lớp.
          </p>
        </div>
      </div>

      {/* Deadlines Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-bold text-slate-800 text-base">
            Quản Lý Toàn Bộ Deadline ({deadlines.length})
          </span>
        </div>

        <DeadlineList
          deadlines={deadlines}
          subjects={subjects}
          completedList={[]}
          currentUser={currentUser}
          viewMode="table"
          showFilter={true}
        />
      </div>

      {/* Student Progress Monitoring */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <span className="text-lg">👥</span>
          <span className="font-bold text-slate-800 text-sm">
            Tiến Độ Sinh Viên Trong Lớp (Dữ liệu từ db.json)
          </span>
        </div>

        <div className="space-y-3">
          {Object.entries(progressMap).map(([email, doneList]) => {
            const count = doneList.length;
            const total = deadlines.length;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={email} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{email}</span>
                  <span className="text-slate-500 font-medium">
                    {count}/{total} bài ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
