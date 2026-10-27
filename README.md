# Class Deadline Hub - PTIT

Hệ thống Quản lý Hạn chót Bài tập & Thi cử sinh viên Học viện Công nghệ Bưu chính Viễn thông.
Học phần: **Lập trình Web Nâng Cao (TH03)** - Mã SV: **B23DCCC168**.

---

## 📁 Cấu Trúc Dự Án (Clean Architecture)

```
class-deadline-hub/
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── not-found.tsx
│   │   ├── loading.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   │
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── 403/
│   │   │   │   └── page.tsx
│   │   │   ├── subjects/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── deadlines/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           ├── page.tsx
│   │   │           └── opengraph-image.tsx
│   │   │
│   │   └── (app)/
│   │       ├── layout.tsx
│   │       ├── dashboard/
│   │       │   ├── layout.tsx
│   │       │   ├── loading.tsx
│   │       │   └── page.tsx
│   │       └── admin/
│   │           ├── loading.tsx
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── badge.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── public-header.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   └── dashboard-nav.tsx
│   │   └── deadlines/
│   │       ├── deadline-card.tsx
│   │       ├── deadline-list.tsx
│   │       ├── deadline-filter.tsx
│   │       ├── deadline-form.tsx
│   │       ├── countdown.tsx
│   │       └── completion-button.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── actions.ts
│   │   │   ├── auth.config.ts
│   │   │   └── session.ts
│   │   ├── subjects/
│   │   │   └── subject.service.ts
│   │   └── deadlines/
│   │       ├── deadline.service.ts
│   │       ├── deadline.repository.ts
│   │       ├── deadline.schema.ts
│   │       └── deadline.actions.ts
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── permissions.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   │
│   ├── data/
│   │   └── db.json
│   │
│   ├── types/
│   │   ├── deadline.ts
│   │   ├── auth.ts
│   │   └── next-auth.d.ts
│   │
│   └── proxy.ts
│
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 👥 Tài Khoản Kiểm Thử

| Email | Mật khẩu | Vai trò | Quyền hạn |
|---|---|---|---|
| `admin@ptit.edu.vn` | `admin123` | **Lớp trưởng (Admin)** | Truy cập `/admin`, Thêm và Xoá deadline, theo dõi tiến độ cả lớp |
| `sv@ptit.edu.vn` | `sv123456` | **Sinh viên (User)** | Xem deadline công khai, đánh dấu hoàn thành bài tập |
| *Khách vãng lai* | *Không cần* | *Khách (Public)* | Xem công khai, chia sẻ link có ảnh OG, lọc và tìm kiếm |

---

## 🚀 Khởi Chạy Ứng Dụng

```bash
# Cài đặt dependencies (nếu chưa)
npm install

# Khởi chạy máy chủ phát triển
npm run dev

# Kiểm tra lint
npm run lint

# Build production
npm run build
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).
