"use client";

import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { ReloadOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <Result
          status="error"
          title="Đã xảy ra lỗi!"
          subTitle={
            <div className="space-y-2">
              <p className="text-slate-600 text-sm">
                Hệ thống gặp sự cố trong quá trình xử lý yêu cầu của bạn.
              </p>
              {error.message && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-100 font-mono text-left break-all">
                  {error.message}
                </div>
              )}
            </div>
          }
          extra={[
            <Button
              key="retry"
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => reset()}
              className="bg-[#c8102e] hover:bg-[#b00e28]"
            >
              Thử lại
            </Button>,
            <Link key="home" href="/">
              <Button icon={<HomeOutlined />}>Trang chủ</Button>
            </Link>,
          ]}
        />
      </div>
    </div>
  );
}
