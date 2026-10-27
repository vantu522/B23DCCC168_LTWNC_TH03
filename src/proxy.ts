import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu người dùng đã đăng nhập mà truy cập trang /login
  if (pathname === "/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "ptit-class-deadline-hub-secret-key-2026",
    });

    if (token) {
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Bảo vệ route /admin và /dashboard: Chỉ Lớp trưởng (Admin) mới có quyền truy cập
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "ptit-class-deadline-hub-secret-key-2026",
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Nếu là sinh viên (role user) cố tình vào khu vực quản trị admin/dashboard -> Chặn và chuyển hướng ngay sang /403
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|api/auth).*)",
  ],
};
