import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "./globals.css";

// Tiêu chí 16: Dùng next/font hỗ trợ bộ ký tự tiếng Việt đầy đủ
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://class-deadline-hub.ptit.edu.vn";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c8102e",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Class Deadline Hub | Cổng Thông Tin & Quản Lý Deadline PTIT",
    template: "%s | Class Deadline Hub PTIT",
  },
  description:
    "Cổng thông tin hạn chót bài tập, thực hành và lịch thi công khai dành cho sinh viên Học viện Công nghệ Bưu chính Viễn thông (PTIT). Tra cứu nhanh, cập nhật thời gian thực và quản lý tiến độ học tập.",
  keywords: [
    "Class Deadline Hub",
    "PTIT",
    "Học viện Công nghệ Bưu chính Viễn thông",
    "quản lý deadline",
    "hạn chót bài tập",
    "lập trình web nâng cao",
    "an toàn thông tin",
    "kiến trúc phần mềm",
    "trí tuệ nhân tạo",
  ],
  authors: [{ name: "B23DCCC168 - PTIT", url: siteUrl }],
  creator: "B23DCCC168",
  publisher: "PTIT Class Management",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    title: "Class Deadline Hub | Cổng Thông Tin Deadline Công Khai PTIT",
    description:
      "Xem hạn nộp bài tập, đề tài, báo cáo thực hành của các môn học PTIT. Sinh viên theo dõi tiến độ cá nhân, lớp trưởng quản lý hạn chót nhanh chóng.",
    siteName: "Class Deadline Hub PTIT",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Class Deadline Hub - Cổng Thông Tin Deadline PTIT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Class Deadline Hub | Cổng Thông Tin Deadline PTIT",
    description:
      "Cổng thông tin quản lý hạn chót bài tập, thực hành và kiểm tra của sinh viên PTIT.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/images/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f7fa] text-slate-800">
        <AntdRegistry>
          <ConfigProvider
            locale={viVN}
            theme={{
              token: {
                colorPrimary: "#c8102e", // Màu đỏ nhận diện thương hiệu PTIT
                borderRadius: 8,
                fontFamily: "var(--font-inter), sans-serif",
                colorLink: "#c8102e",
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
