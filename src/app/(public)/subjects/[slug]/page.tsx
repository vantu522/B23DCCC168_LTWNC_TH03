import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SubjectService } from "@/features/subjects/subject.service";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { getCurrentUser } from "@/lib/auth";
import DeadlineList from "@/components/deadlines/deadline-list";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = await SubjectService.getSubjectBySlug(slug);

  if (!subject) {
    return { title: "Môn học không tồn tại | PTIT" };
  }

  return {
    title: `Môn ${subject.name} (${subject.code}) | Class Deadline Hub PTIT`,
    description: `Xem các hạn nộp bài tập, thực hành và lịch thi môn ${subject.name} - Giảng viên: ${subject.lecturer}.`,
  };
}

export default async function SubjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const subject = await SubjectService.getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const [allDeadlines, allSubjects, currentUser] = await Promise.all([
    DeadlineService.getDeadlinesBySubject(subject.id),
    SubjectService.getAllSubjects(),
    getCurrentUser(),
  ]);

  let completedIds: string[] = [];
  if (currentUser) {
    completedIds = await DeadlineService.getUserProgress(currentUser.email);
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#c8102e]">Trang chủ</Link>
        <span>/</span>
        <Link href="/deadlines" className="hover:text-[#c8102e]">Môn học</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{subject.name}</span>
      </nav>

      {/* Subject Header Card bằng Tailwind */}
      <div
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs border-t-4 border-t-[#c8102e]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold uppercase text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {subject.code}
              </span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                {subject.credit} Tín chỉ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 m-0">
              {subject.name}
            </h1>
            {subject.description && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                {subject.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <strong>Giảng viên:</strong> {subject.lecturer}
            </div>
            <div>
              <strong>Phòng:</strong> {subject.room}
            </div>
            <div>
              <strong>Số bài tập:</strong> {allDeadlines.length} bài
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách bài tập của môn */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Hạn Chót Bài Tập Của Môn Này ({allDeadlines.length})
        </h2>
        <DeadlineList
          deadlines={allDeadlines}
          subjects={allSubjects}
          completedList={completedIds}
          currentUser={currentUser}
          viewMode="grid"
          showFilter={false}
        />
      </div>
    </div>
  );
}
