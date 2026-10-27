import React from "react";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";
import { getCurrentUser } from "@/lib/auth";
import DeadlineList from "@/components/deadlines/deadline-list";

export const metadata = {
  title: "Tất Cả Hạn Chót Bài Tập | Class Deadline Hub PTIT",
  description: "Tra cứu toàn bộ hạn nộp bài tập, thực hành và thi cử các môn học PTIT.",
};

export default async function DeadlinesPage() {
  const [deadlines, subjects, currentUser] = await Promise.all([
    DeadlineService.getAllDeadlines(),
    SubjectService.getAllSubjects(),
    getCurrentUser(),
  ]);

  let completedIds: string[] = [];
  if (currentUser) {
    completedIds = await DeadlineService.getUserProgress(currentUser.email);
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 m-0">
          Tất Cả Hạn Chót Bài Tập Lớp Học
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 m-0">
          Xem và lọc toàn bộ hạn chót nộp bài tập công khai.
        </p>
      </div>

      <DeadlineList
        deadlines={deadlines}
        subjects={subjects}
        completedList={completedIds}
        currentUser={currentUser}
        viewMode="grid"
        showFilter={true}
      />
    </div>
  );
}
