import { Role, SafeUser } from "@/types/auth";

export type RoleType = Role | "guest";

export type PermissionAction =
  | "view_deadline"
  | "mark_completion"
  | "create_deadline"
  | "delete_deadline"
  | "Xem deadline"
  | "Đánh dấu đã xong"
  | "Thêm deadline"
  | "Xoá deadline";


export const PERMISSION_MATRIX: Record<PermissionAction, Record<RoleType, boolean>> = {
  view_deadline: {
    guest: true,
    user: true,
    admin: true,
  },
  "Xem deadline": {
    guest: true,
    user: true,
    admin: true,
  },
  mark_completion: {
    guest: false,
    user: true,
    admin: true,
  },
  "Đánh dấu đã xong": {
    guest: false,
    user: true,
    admin: true,
  },
  create_deadline: {
    guest: false,
    user: false,
    admin: true,
  },
  "Thêm deadline": {
    guest: false,
    user: false,
    admin: true,
  },
  delete_deadline: {
    guest: false,
    user: false,
    admin: true,
  },
  "Xoá deadline": {
    guest: false,
    user: false,
    admin: true,
  },
};

/**
 * Hàm can(role, action): hàm kiểm tra quyền duy nhất cho toàn hệ thống
 * @param role: RoleType ("guest" | "user" | "admin") hoặc đối tượng SafeUser | null | undefined
 * @param action: Hành động cần kiểm tra (tiếng Anh hoặc tiếng Việt)
 */
export function can(
  role: RoleType | SafeUser | null | undefined,
  action: PermissionAction
): boolean {
  let resolvedRole: RoleType = "guest";

  if (role) {
    if (typeof role === "string") {
      resolvedRole = role;
    } else if (typeof role === "object" && "role" in role) {
      resolvedRole = role.role;
    }
  }

  const actionRule = PERMISSION_MATRIX[action];
  if (!actionRule) {
    return false;
  }

  return actionRule[resolvedRole] ?? false;
}

// Các helper tương thích ngược trong hệ thống
export function isAdmin(user: SafeUser | null | undefined): boolean {
  return can(user, "Thêm deadline");
}

export function isStudent(user: SafeUser | null | undefined): boolean {
  return !!user && user.role === "user";
}

export function canManageDeadlines(user: SafeUser | null | undefined): boolean {
  return can(user, "Thêm deadline") && can(user, "Xoá deadline");
}

export function canMarkCompletion(user: SafeUser | null | undefined): boolean {
  return can(user, "Đánh dấu đã xong");
}
