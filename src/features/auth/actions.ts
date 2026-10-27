"use server";

import { readDb } from "@/lib/db";
import { SafeUser } from "@/types/auth";
import { getSession } from "./session";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function loginAction(formData: FormData): Promise<ActionResult<SafeUser>> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Vui lòng nhập đầy đủ Email và Mật khẩu" };
  }

  const db = await readDb();
  const found = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) {
    return { success: false, error: "Email hoặc mật khẩu không chính xác" };
  }

  const safeUser: SafeUser = {
    id: found.id,
    email: found.email,
    name: found.name,
    role: found.role,
  };

  return { success: true, data: safeUser };
}

export async function logoutAction(): Promise<ActionResult> {
  return { success: true };
}

export async function getCurrentUserAction(): Promise<SafeUser | null> {
  const session = await getSession();
  return session.user;
}
