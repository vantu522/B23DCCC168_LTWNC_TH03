import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://class-deadline-hub.ptit.edu.vn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/deadlines", "/deadlines/*", "/subjects", "/subjects/*"],
        // Tiêu chí 14: chặn /dashboard, /admin. /login và /dashboard không được lập chỉ mục
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/admin",
          "/admin/*",
          "/login",
          "/403",
          "/api/*",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
