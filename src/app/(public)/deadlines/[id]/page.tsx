import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import dayjs from "dayjs";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";
import { getCurrentUser } from "@/lib/auth";
import Countdown from "@/components/deadlines/countdown";
import CompletionButton from "@/components/deadlines/completion-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([
    DeadlineService.getDeadlineById(id),
    SubjectService.getAllSubjects(),
  ]);

  if (!deadline) {
    return { title: "Không tìm thấy bài tập | PTIT" };
  }

  const subject = subjects.find((s) => s.id === deadline.subjectId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://class-deadline-hub.ptit.edu.vn";
  const dueFormatted = dayjs(deadline.dueDate).format("HH:mm ngày DD/MM/YYYY");
  const title = `${deadline.title} - Hạn: ${dueFormatted} | PTIT`;
  const description = `${subject ? subject.name : deadline.subjectId} • Hạn nộp: ${dueFormatted}. ${deadline.description || "Xem chi tiết deadline và link nộp."}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/deadlines/${id}`,
      siteName: "Class Deadline Hub PTIT",
      type: "article",
      images: [
        {
          url: `/deadlines/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: deadline.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/deadlines/${id}/opengraph-image`],
    },
  };
}

export default async function DeadlineDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [deadline, subjects, currentUser] = await Promise.all([
    DeadlineService.getDeadlineById(id),
    SubjectService.getAllSubjects(),
    getCurrentUser(),
  ]);

  if (!deadline) {
    notFound();
  }

  const subject = subjects.find((s) => s.id === deadline.subjectId);
  let isCompleted = false;
  if (currentUser) {
    const doneList = await DeadlineService.getUserProgress(currentUser.email);
    isCompleted = doneList.includes(deadline.id);
  }

  const due = dayjs(deadline.dueDate);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://class-deadline-hub.ptit.edu.vn";

  // Tiêu chí 15: Structured Data (JSON-LD) kiểu BreadcrumbList chuẩn Schema.org cho SEO Google
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Danh sách Deadline",
        item: `${siteUrl}/deadlines`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: deadline.title,
        item: `${siteUrl}/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
      {/* Structured data (JSON-LD) kiểu BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Breadcrumb trực quan */}
      <nav className="mb-6 text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#c8102e]">Trang chủ</Link>
        <span>/</span>
        <Link href="/deadlines" className="hover:text-[#c8102e]">Deadline</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">{deadline.title}</span>
      </nav>

      {/* Main Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {/* Navigation & Actions Top */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <Link
            href="/deadlines"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#c8102e]"
          >
            ← Quay lại danh sách
          </Link>

          <CompletionButton
            deadlineId={deadline.id}
            isCompleted={isCompleted}
            canMark={!!currentUser}
          />
        </div>

        {/* Badges: Đồng bộ tối đa 3 màu: Slate, Đỏ PTIT, Xanh lá (Bỏ toàn bộ icon/emoji) */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {subject && (
            <Link href={`/subjects/${subject.slug}`}>
              <span className="border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-0.5 rounded-full inline-block hover:bg-slate-200 transition-colors">
                {subject.code} - {subject.name}
              </span>
            </Link>
          )}

          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
            {deadline.type}
          </span>

          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2.5 py-0.5 rounded-full">
            {deadline.target || "Cá nhân"}
          </span>

          {deadline.priority === "high" && (
            <span className="bg-red-50 text-red-600 border border-red-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Ưu tiên cao
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
          {deadline.title}
        </h1>

        {/* Due Date Banner (Đã bỏ icon đồng hồ và icon countdown) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 text-sm">Hạn chót:</span>
            <span className="font-bold text-red-600 text-base">
              {due.format("HH:mm - DD/MM/YYYY")}
            </span>
          </div>

          <Countdown dueDate={deadline.dueDate} showIcon={false} />
        </div>

        {/* Details Grid (Đã bỏ icon lịch thông báo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-6 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block mb-0.5">Môn học & Giảng viên</span>
            <span className="font-bold text-slate-800 text-sm block">
              {subject ? subject.name : deadline.subjectId}
            </span>
            <span className="text-slate-500">
              Giảng viên: {subject?.lecturer} • Phòng: {subject?.room}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Thời gian thông báo</span>
            <span className="font-medium text-slate-700">
              {dayjs(deadline.createdAt).format("DD/MM/YYYY HH:mm")}
            </span>
            <span className="text-slate-400 block mt-0.5">
              Hình thức: {deadline.target || "Cá nhân"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-800 mb-2">Yêu cầu bài tập chi tiết:</h2>
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {deadline.description || "Không có yêu cầu chi tiết."}
          </div>
        </div>

        {/* Submission link */}
        {deadline.submissionUrl && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800 text-xs block">Nơi tiếp nhận bài nộp:</span>
              <a
                href={deadline.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#c8102e] hover:underline font-medium break-all"
              >
                {deadline.submissionUrl}
              </a>
            </div>

            <a
              href={deadline.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#c8102e] hover:bg-[#a00d24] text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
            >
              Nộp bài trực tuyến
            </a>
          </div>
        )}

       
      </div>
    </div>
  );
}
