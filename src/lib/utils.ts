import dayjs from "dayjs";

export function formatDate(dateString: string, format = "DD/MM/YYYY"): string {
  return dayjs(dateString).format(format);
}

export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format("HH:mm - DD/MM/YYYY");
}

export interface CountdownInfo {
  text: string;
  color: "error" | "default";
  isOverdue: boolean;
  isUrgent: boolean;
  diffDays: number;
  diffHours: number;
}

export function calculateCountdown(dueDateString: string): CountdownInfo {
  const due = dayjs(dueDateString);
  const now = dayjs();
  const isOverdue = due.isBefore(now);
  const diffHours = due.diff(now, "hour");
  const diffDays = due.diff(now, "day");

  if (isOverdue) {
    const pastDays = Math.abs(diffDays);
    return {
      text: pastDays === 0 ? "Quá hạn hôm nay" : `Quá hạn ${pastDays} ngày`,
      color: "error",
      isOverdue: true,
      isUrgent: false,
      diffDays,
      diffHours,
    };
  }

  if (diffHours <= 0) {
    return {
      text: "Hết hạn trong giờ tới!",
      color: "error",
      isOverdue: false,
      isUrgent: true,
      diffDays,
      diffHours,
    };
  }

  if (diffHours < 24) {
    return {
      text: `Còn ${diffHours} giờ`,
      color: "error",
      isOverdue: false,
      isUrgent: true,
      diffDays,
      diffHours,
    };
  }

  if (diffDays <= 3) {
    return {
      text: `Còn ${diffDays} ngày`,
      color: "error",
      isOverdue: false,
      isUrgent: true,
      diffDays,
      diffHours,
    };
  }

  return {
    text: `Còn ${diffDays} ngày`,
    color: "default",
    isOverdue: false,
    isUrgent: false,
    diffDays,
    diffHours,
  };
}
