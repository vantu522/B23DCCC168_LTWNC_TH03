import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { readDb } from "@/lib/db";
import { Role, SafeUser } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const db = await readDb();
        const found = db.users.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password
        );

        if (!found) {
          return null;
        }

        return {
          id: found.id,
          email: found.email,
          name: found.name,
          role: found.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Nếu đăng nhập qua Credentials thì user.role đã có
        if (user.role) {
          token.role = user.role;
        } else {
          // Đăng nhập qua OAuth (GitHub):
          // Kiểm tra xem email có trùng với user nào trong database không
          const userEmail = (user.email || token.email || "").toLowerCase();
          const db = await readDb();
          const existing = db.users.find((u) => u.email.toLowerCase() === userEmail);

          if (existing) {
            token.id = existing.id;
            token.role = existing.role as Role;
          } else {
            // Mặc định sinh viên ("user")
            const isAdmin = userEmail.includes("admin");
            token.role = (isAdmin ? "admin" : "user") as Role;
            token.id = user.id || (token.sub as string) || `gh_${Date.now()}`;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || "user";
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "ptit-class-deadline-hub-secret-key-2026",
};

export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      image: session.user.image || undefined,
    };
  } catch {
    return null;
  }
}
