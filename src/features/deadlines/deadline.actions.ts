"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { DeadlineService } from "./deadline.service";
import { validateDeadlineInput } from "./deadline.schema";
import { CreateDeadlineInput, Deadline } from "@/types/deadline";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Server Action: Thêm deadline mới
 * - Phân quyền độc lập phía Server: chỉ Lớp trưởng (Admin) mới có quyền
 * - Kiểm tra tính hợp lệ của toàn bộ dữ liệu đầu vào (Input Validation)
 */
export async function createDeadlineAction(
  input: CreateDeadlineInput
): Promise<ActionResponse<Deadline>> {
  const user = await getCurrentUser();

  // 1. Tự kiểm tra quyền phía server bằng ma trận phân quyền
  if (!can(user, "Thêm deadline")) {
    return {
      success: false,
      error: "Bạn không có quyền thêm deadline. Chỉ Lớp trưởng (Admin) mới được phép thực hiện.",
    };
  }

  // 2. Kiểm tra tính hợp lệ dữ liệu đầu vào (Validation)
  const { valid, errors } = validateDeadlineInput(input);
  if (!valid) {
    const firstErr = Object.values(errors)[0];
    return { success: false, error: firstErr || "Dữ liệu bài tập không hợp lệ" };
  }

  try {
    const created = await DeadlineService.createDeadline({
      title: input.title.trim(),
      subjectId: input.subjectId.trim().toUpperCase(),
      dueDate: input.dueDate,
      type: input.type || "Bài tập",
      priority: input.priority || "medium",
      description: input.description?.trim(),
      submissionUrl: input.submissionUrl?.trim(),
      target: input.target?.trim() || "Cá nhân",
    });

    revalidatePath("/");
    revalidatePath("/deadlines");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: created,
      message: "Tạo deadline thành công!",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi lưu deadline vào hệ thống",
    };
  }
}

/**
 * Server Action: Xoá deadline
 * - Phân quyền độc lập phía Server: chỉ Lớp trưởng (Admin) mới có quyền
 * - Kiểm tra ID hợp lệ
 */
export async function deleteDeadlineAction(id: string): Promise<ActionResponse> {
  const user = await getCurrentUser();

  // 1. Tự kiểm tra quyền phía server bằng ma trận phân quyền
  if (!can(user, "Xoá deadline")) {
    return {
      success: false,
      error: "Bạn không có quyền xoá deadline. Chỉ Lớp trưởng (Admin) mới được phép thực hiện.",
    };
  }

  // 2. Kiểm tra tính hợp lệ dữ liệu đầu vào
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return { success: false, error: "ID deadline không hợp lệ" };
  }

  try {
    const ok = await DeadlineService.deleteDeadline(id.trim());
    if (!ok) {
      return { success: false, error: "Không tìm thấy deadline cần xoá" };
    }

    revalidatePath("/");
    revalidatePath("/deadlines");
    revalidatePath("/dashboard");

    return { success: true, message: "Đã xoá deadline thành công!" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi xoá deadline",
    };
  }
}

/**
 * Server Action: Đánh dấu đã xong / chưa xong deadline
 * - Phân quyền độc lập phía Server: Sinh viên hoặc Admin đã đăng nhập
 * - Kiểm tra ID hợp lệ
 */
export async function toggleCompletionAction(
  deadlineId: string
): Promise<ActionResponse<{ completed: boolean; completedList: string[] }>> {
  const user = await getCurrentUser();

  // 1. Tự kiểm tra quyền phía server bằng ma trận phân quyền
  if (!user || !can(user, "Đánh dấu đã xong")) {
    return {
      success: false,
      error: "Vui lòng đăng nhập để đánh dấu trạng thái bài tập",
    };
  }

  // 2. Kiểm tra tính hợp lệ dữ liệu đầu vào
  if (!deadlineId || typeof deadlineId !== "string" || deadlineId.trim().length === 0) {
    return { success: false, error: "ID bài tập không hợp lệ" };
  }

  try {
    const result = await DeadlineService.toggleCompletion(user.email, deadlineId.trim());
    revalidatePath("/");
    revalidatePath("/deadlines");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: result,
      message: result.completed
        ? "Đã đánh dấu hoàn thành bài tập!"
        : "Đã bỏ đánh dấu hoàn thành.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái bài tập",
    };
  }
}
