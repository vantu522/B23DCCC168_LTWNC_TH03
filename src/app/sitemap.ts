import type { MetadataRoute } from "next";
import { DeadlineService } from "@/features/deadlines/deadline.service";
import { SubjectService } from "@/features/subjects/subject.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://class-deadline-hub.ptit.edu.vn";

  const [deadlines, subjects] = await Promise.all([
    DeadlineService.getAllDeadlines(),
    SubjectService.getAllSubjects(),
  ]);

  // 1. Các trang tĩnh chính
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 2. Từng trang môn học
  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((s) => ({
    url: `${siteUrl}/subjects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Mọi deadline công khai (Tiêu chí 14: sitemap gồm mọi deadline)
  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((d) => ({
    url: `${siteUrl}/deadlines/${d.id}`,
    lastModified: new Date(d.createdAt || Date.now()),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
