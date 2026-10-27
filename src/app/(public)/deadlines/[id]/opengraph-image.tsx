import { ImageResponse } from "next/og";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";
import dayjs from "dayjs";

export const alt = "Class Deadline Hub - Chi Tiết Hạn Chót PTIT";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([
    DeadlineService.getDeadlineById(id),
    SubjectService.getAllSubjects(),
  ]);

  const title = deadline?.title || "Hạn Chót Bài Tập PTIT";
  const subject = subjects.find((s) => s.id === deadline?.subjectId);
  const subjectName = subject ? `${subject.code} - ${subject.name}` : "Học viện Công nghệ Bưu chính Viễn thông";
  const due = deadline ? dayjs(deadline.dueDate).format("HH:mm - DD/MM/YYYY") : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #881337 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                backgroundColor: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
              }}
            >
              ⏰
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "22px", fontWeight: 800 }}>CLASS DEADLINE HUB</span>
              <span style={{ fontSize: "14px", color: "#fca5a5" }}>PTIT - CỔNG THÔNG TIN CÔNG KHAI</span>
            </div>
          </div>

          <div
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {subjectName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: "-1px",
              color: "white",
            }}
          >
            {title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#fecdd3",
                backgroundColor: "rgba(239, 68, 68, 0.25)",
                padding: "8px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(244, 63, 94, 0.4)",
              }}
            >
              Hạn chót: {due}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#cbd5e1",
          }}
        >
          <span>🌐 Xem công khai không cần tài khoản</span>
          <span style={{ fontFamily: "monospace", color: "#94a3b8" }}>B23DCCC168 - TH03</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
