import { getCurrentUser } from "@/lib/auth";
import { SafeUser } from "@/types/auth";

export async function getSession(): Promise<{ user: SafeUser | null }> {
  const user = await getCurrentUser();
  return { user };
}

export async function createSession(): Promise<void> {
  // Quản lý bởi NextAuth JWT Credentials strategy
}

export async function destroySession(): Promise<void> {
  // Quản lý bởi NextAuth signOut
}
