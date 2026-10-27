import { CreateDeadlineInput } from "@/types/deadline";

export const VALID_SUBJECT_IDS = ["LTWNC", "ATTT", "KTPM", "TTNT"];
export const VALID_TYPES = ["Thực hành", "Bài tập lớn", "Bài tập", "Tiểu luận", "Kiểm tra"];
export const VALID_PRIORITIES = ["low", "medium", "high"];

export function validateDeadlineInput(
  input: Partial<CreateDeadlineInput>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // 1. Kiểm tra tiêu đề
  if (!input.title || typeof input.title !== "string" || input.title.trim().length === 0) {
    errors.title = "Tiêu đề deadline là bắt buộc";
  } else if (input.title.trim().length < 3) {
    errors.title = "Tiêu đề deadline phải có ít nhất 3 ký tự";
  } else if (input.title.trim().length > 200) {
    errors.title = "Tiêu đề deadline không được vượt quá 200 ký tự";
  }

  // 2. Kiểm tra môn học
  if (!input.subjectId || typeof input.subjectId !== "string" || input.subjectId.trim().length === 0) {
    errors.subjectId = "Vui lòng chọn môn học";
  } else if (!VALID_SUBJECT_IDS.includes(input.subjectId.trim().toUpperCase())) {
    errors.subjectId = `Môn học không hợp lệ. Chỉ chấp nhận: ${VALID_SUBJECT_IDS.join(", ")}`;
  }

  // 3. Kiểm tra hạn chót
  if (!input.dueDate || typeof input.dueDate !== "string" || input.dueDate.trim().length === 0) {
    errors.dueDate = "Vui lòng chọn ngày và giờ hạn chót";
  } else {
    const timestamp = Date.parse(input.dueDate);
    if (isNaN(timestamp)) {
      errors.dueDate = "Định dạng ngày hạn chót không hợp lệ";
    }
  }

  // 4. Kiểm tra phân loại bài tập
  if (input.type && !VALID_TYPES.includes(input.type)) {
    errors.type = `Phân loại không hợp lệ. Phải là một trong: ${VALID_TYPES.join(", ")}`;
  }

  // 5. Kiểm tra mức độ ưu tiên
  if (input.priority && !VALID_PRIORITIES.includes(input.priority)) {
    errors.priority = "Mức độ ưu tiên không hợp lệ (low, medium, high)";
  }

  // 6. Kiểm tra URL nộp bài
  if (input.submissionUrl && input.submissionUrl.trim().length > 0) {
    const trimmedUrl = input.submissionUrl.trim();
    try {
      const url = new URL(trimmedUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.submissionUrl = "Đường dẫn nộp bài phải bắt đầu bằng http:// hoặc https://";
      }
    } catch {
      errors.submissionUrl = "Đường dẫn liên kết nộp bài không đúng định dạng URL";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
