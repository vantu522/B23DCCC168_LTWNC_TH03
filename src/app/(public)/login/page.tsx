"use client";

import React, { useState, Suspense } from "react";
import { Form, Input, Button, Alert, Tag, Typography, Card, Space, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, GithubOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

const { Text, Paragraph } = Typography;

function getOAuthErrorMessage(error: string | null): string | null {
  if (!error) return null;
  if (error === "OAuthSignin" || error === "OAuthCallback") {
    return "Không thể xác thực với GitHub. Vui lòng kiểm tra cấu hình GITHUB_ID và GITHUB_SECRET.";
  }
  if (error === "OAuthCreateAccount") {
    return "Không thể tạo tài khoản từ hồ sơ GitHub.";
  }
  if (error === "CredentialsSignin") {
    return "Email hoặc mật khẩu không chính xác.";
  }
  return "Đã xảy ra lỗi trong quá trình xác thực đăng nhập.";
}

function LoginForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const oauthError = searchParams.get("error");

  const errorMsg = customError || getOAuthErrorMessage(oauthError);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setCustomError(null);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        setCustomError("Email hoặc mật khẩu không chính xác");
      } else {
        const isAdminUser = values.email.toLowerCase().includes("admin");
        if (isAdminUser) {
          // Lớp trưởng (Admin) được chuyển vào bảng quản trị admin
          const target =
            callbackUrl &&
            !callbackUrl.startsWith("//") &&
            callbackUrl.startsWith("/") &&
            callbackUrl !== "/" &&
            callbackUrl !== "/login"
              ? callbackUrl
              : "/admin";
          router.push(target);
        } else {
          // Sinh viên (role user) tuyệt đối không vào trang admin dashboard, chuyển thẳng về trang chủ sinh viên
          router.push("/");
        }
        router.refresh();
      }
    } catch {
      setCustomError("Lỗi khi kết nối tới máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setCustomError(null);
    try {
      await signIn("github", {
        callbackUrl: "/",
      });
    } catch {
      setCustomError("Lỗi khi chuyển hướng đến dịch vụ xác thực GitHub.");
      setGithubLoading(false);
    }
  };

  const fillAccount = (email: string, pass: string) => {
    form.setFieldsValue({ email, password: pass });
    setCustomError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-md rounded-2xl border-slate-200 p-2 sm:p-4">
        <div className="text-center mb-6">
          <Image
            src="/images/logo.svg"
            alt="Logo PTIT"
            width={48}
            height={48}
            priority
            className="rounded-2xl shadow-sm mx-auto mb-3"
          />
          <h1 className="text-xl font-extrabold text-slate-800 m-0">Đăng Nhập Hệ Thống</h1>
          <Paragraph type="secondary" className="text-xs mt-1">
            Cổng Quản Lý Deadline Học Tập - Học viện Công nghệ Bưu chính Viễn thông
          </Paragraph>
        </div>

        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon closable className="mb-4 text-xs" />
        )}

        {/* Nút đăng nhập GitHub OAuth */}
        <div className="mb-4">
          <Button
            size="large"
            block
            icon={<GithubOutlined className="text-lg" />}
            onClick={handleGithubLogin}
            loading={githubLoading}
            className="h-11 font-semibold border-slate-300 text-slate-800 hover:text-black hover:border-slate-800 flex items-center justify-center gap-2 rounded-xl transition-all shadow-xs"
          >
            Đăng nhập bằng GitHub
          </Button>
          <div className="text-center mt-1.5">
            <span className="text-[11px] text-slate-400">
              Tài khoản GitHub được đồng bộ quyền Sinh viên (user)
            </span>
          </div>
        </div>

        <Divider className="my-4 text-xs text-slate-400 font-normal">
          HOẶC DÙNG TÀI KHOẢN PTIT
        </Divider>

        {/* 1-click test accounts */}
        <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <Text strong className="text-xs text-slate-600 block mb-2">
            👉 Nhấp để điền nhanh tài khoản kiểm thử:
          </Text>
          <Space wrap>
            <Button
              size="small"
              type="dashed"
              onClick={() => fillAccount("admin@ptit.edu.vn", "admin123")}
            >
              <Tag color="red" className="mr-1">Admin</Tag> admin@ptit.edu.vn
            </Button>
            <Button
              size="small"
              type="dashed"
              onClick={() => fillAccount("sv@ptit.edu.vn", "sv123456")}
            >
              <Tag color="blue" className="mr-1">Sinh viên</Tag> sv@ptit.edu.vn
            </Button>
          </Space>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email PTIT"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-slate-400" />}
              placeholder="admin@ptit.edu.vn hoặc sv@ptit.edu.vn"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            icon={<LoginOutlined />}
            className="bg-[#c8102e] hover:bg-[#b00e28] mt-2 font-medium"
          >
            Đăng nhập ngay
          </Button>

          <div className="text-center mt-4">
            <Link href="/" className="text-xs text-slate-500 hover:text-[#c8102e]">
              ← Quay lại trang chủ công khai
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">Đang tải biểu mẫu...</div>}>
      <LoginForm />
    </Suspense>
  );
}
