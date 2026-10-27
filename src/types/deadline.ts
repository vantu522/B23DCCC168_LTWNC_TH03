export type Priority = "high" | "medium" | "low";

export type DeadlineType =
  | "Thực hành"
  | "Bài tập"
  | "Bài tập lớn"
  | "Tiểu luận"
  | "Kiểm tra";

export interface Subject {
  id: string;
  slug: string;
  code: string;
  name: string;
  credit: number;
  lecturer: string;
  room: string;
  color: string;
  description?: string;
}

export interface Deadline {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601 string
  priority: Priority;
  type: DeadlineType;
  submissionUrl?: string;
  target?: string;
  createdAt: string;
}

export interface CreateDeadlineInput {
  subjectId: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  type: DeadlineType;
  submissionUrl?: string;
  target?: string;
}

export interface StudentProgressMap {
  [email: string]: string[];
}
