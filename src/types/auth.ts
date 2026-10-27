export type Role = "admin" | "user";

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: Role;
  image?: string;
}

export type SafeUser = Omit<User, "password">;

export interface SessionData {
  user: SafeUser | null;
  expiresAt?: string;
}
