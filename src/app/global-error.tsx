"use client";

import React from "react";
import { Button, Result } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <Result
            status="500"
            title="Lỗi Toàn Cục"
            subTitle={error.message || "Đã xảy ra sự cố nghiêm trọng trên hệ thống."}
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => reset()}
                className="bg-[#c8102e]"
              >
                Tải lại trang
              </Button>
            }
          />
        </div>
      </body>
    </html>
  );
}
