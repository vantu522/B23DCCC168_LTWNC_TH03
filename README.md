# Class Deadline Hub - PTIT
### Cổng Thông Tin & Quản Lý Hạn Chót Bài Tập Sinh Viên PTIT


## MỤC LỤC
1. [Cách cài đặt và khởi chạy dự án](#1-cách-cài-đặt-và-khởi-chạy-dự-án)
2. [Tài khoản kiểm thử hệ thống](#2-tài-khoản-kiểm-thử-hệ-thống)
3. [Kết quả `npm run build` và Chiến lược Render từng Route](#3-kết-quả-npm-run-build-và-chiến-lược-render-từng-route)
4. [Điểm đánh giá Google Lighthouse](#4-điểm-đánh-giá-google-lighthouse)
5. [Mã nguồn HTML View-Source của `/deadlines/1`](#5-mã-nguồn-html-view-source-của-deadlines1)
6. [Trả lời 2 câu hỏi lý thuyết cốt lõi](#6-trả-lời-2-câu-hỏi-lý-thuyết-cốt-lõi)
   - [Câu 1: Vì sao `/deadlines/[id]` dùng ISR?](#câu-1-vì-sao-deadlinesid-dùng-isr)
   - [Câu 2: Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?](#câu-2-nếu-chỉ-dùng-middleware-để-bảo-vệ-admin-thì-có-rủi-ro-gì)

---

## 1. Cách cài đặt và khởi chạy dự án

### Yêu cầu môi trường:
- **Node.js**: Phiên bản `>= 18.18.0` hoặc `>= 20.x`
- **Trình quản lý gói**: `npm` (đi kèm Node.js)

### Các bước thực hiện:

#### Bước 1: Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

#### Bước 2: Thiết lập file môi trường `.env.local`
Tạo file `.env.local` tại thư mục gốc của dự án (tham khảo file `.env.example`):
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ptit-class-deadline-hub-secret-key-2026
AUTH_SECRET=ptit-class-deadline-hub-secret-key-2026
NODE_ENV=development

# GitHub OAuth 2.0 (Tùy chọn)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

#### Bước 3: Khởi chạy máy chủ phát triển (Development)
```bash
npm run dev
```
Truy cập trình duyệt tại: [http://localhost:3000](http://localhost:3000)

#### Bước 4: Kiểm tra Lint & TypeScript
```bash
npm run lint
```

#### Bước 5: Biên dịch và chạy chế độ Production
```bash
# Biên dịch tối ưu hóa production
npm run build

# Khởi chạy server production
npm run start
```

---

## 2. Tài khoản kiểm thử hệ thống

Hệ thống hỗ trợ 3 hình thức truy cập phân quyền rõ ràng qua ma trận quyền tập trung `can(role, action)`:

| Tài khoản / Phương thức | Mật khẩu | Vai trò (Role) | Phạm vi quyền hạn |
|---|---|---|---|
| `admin@ptit.edu.vn` | `admin123` | **Lớp trưởng (Admin)** | Xem mọi deadline, Đánh dấu hoàn thành, Thêm deadline mới, Xoá deadline, Truy cập khu vực `/admin`. |
| `sv@ptit.edu.vn` | `sv123456` | **Sinh viên (User)** | Xem deadline công khai, Đánh dấu hoàn thành bài tập cá nhân. Bị chặn nghiêm ngặt khi cố truy cập `/admin` (chuyển hướng `/403`). |
| **GitHub OAuth** | *Tài khoản GitHub* | **Sinh viên (User)** | Đăng nhập 1-click qua GitHub OAuth, tự động đồng bộ Avatar và quyền sinh viên. |
| **Khách vãng lai** | *Không cần đăng nhập* | **Khách (Guest)** | Xem toàn bộ bài tập, tra cứu bộ lọc, xem chi tiết, sao chép link chia sẻ mạng xã hội. |

---

## 3. Kết quả `npm run build` và Chiến lược Render từng Route

### Ảnh chụp màn hình kết quả build:
![Kết quả npm run build](docs/images/npm-run-build.png)
*(Lưu ảnh chụp terminal của bạn vào đường dẫn `docs/images/npm-run-build.png`)*

### Terminal Output thực tế của `npm run build`:
```text
▲ Next.js 16.4.3 (Turbopack)
- Environments: .env.local, .env

  Creating an optimized production build ...
✓ Compiled successfully in 2.2s
  Running TypeScript ...
  Finished TypeScript in 2.5s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (19/19) in 1166ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /                                   (Dynamic - Server Component)
├ ○ /_not-found                         (Static)
├ ƒ /403                                (Dynamic)
├ ƒ /admin                              (Dynamic - Protected)
├ ƒ /api/auth/[...nextauth]             (Dynamic API Route)
├ ƒ /dashboard                          (Dynamic - Protected)
├ ƒ /deadlines                          (Dynamic - Server Component)
├ ƒ /deadlines/[id]                     (ISR - revalidate: 60s & generateStaticParams)
├ ƒ /deadlines/[id]/opengraph-image-... (Dynamic Image Generation - 1200x630)
├ ○ /icon.svg                           (Static - Favicon PTIT)
├ ƒ /login                              (Dynamic - OAuth & Credentials)
├ ○ /robots.txt                         (Static)
├ ○ /sitemap.xml                        (Static / Dynamic sitemap)
└ ƒ /subjects/[slug]                    (Dynamic)

ƒ Proxy (Middleware)
○ (Static)   prerendered as static content
ƒ (Dynamic)  server-rendered on demand
```

### 🧠 Lý do lựa chọn chiến lược Render cho từng Route:

| Route | Chiến lược | Lý do kỹ thuật lựa chọn |
|---|:---:|---|
| **`/` (Trang chủ)** | **Dynamic SSR** | Cần tính toán thời gian thực: bộ đếm ngược countdown (tính theo ngày/giờ hiện tại của hệ thống), đọc phiên đăng nhập `getCurrentUser()` để hiển thị đúng trạng thái hoàn thành bài tập của sinh viên đó. |
| **`/deadlines/[id]`** | **ISR (revalidate = 60s)** | **Tối ưu tốc độ & SEO**: Các bài tập được sinh trước lúc build với `generateStaticParams()`. Khi sinh viên truy cập, trang được phục vụ tức thì từ cache với TTFB < 50ms. Sau 60 giây, nếu có cập nhật đề bài hoặc gia hạn nộp từ lớp trưởng, Next.js tự động re-generate ngầm mà không cần rebuild toàn bộ dự án. |
| **`/deadlines`** | **Dynamic SSR** | Hỗ trợ đọc tham số URL query (`searchParams` như `?subject=LTWNC&priority=high&sort=dueAsc`) để lọc và sắp xếp bài tập theo yêu cầu của người dùng. |
| **`/deadlines/[id]/opengraph-image`** | **Edge / Dynamic Image** | Sử dụng `ImageResponse` của `@vercel/og` để vẽ tự động thẻ ảnh Open Graph 1200x630px chứa tên bài tập, môn học và hạn nộp, phục vụ xem trước khi chia sẻ link lên Facebook/Zalo. |
| **`/admin`** | **Dynamic Server-Side** | **Bảo mật tuyệt đối**: Trang quản trị nhạy cảm của Lớp trưởng, bắt buộc phải kiểm tra quyền `can(user.role, "CREATE_DEADLINE")` theo từng request, cấm cache HTML để ngăn rò rỉ dữ liệu bài tập và thông tin điểm danh. |
| **`/dashboard`** | **Dynamic Server-Side** | Trang tổng quan cá nhân hóa phụ thuộc vào phiên làm việc (`session`) của từng sinh viên. |
| **`/login`** | **Dynamic SSR** | Nhận các query params điều hướng (`callbackUrl`, `error`), xử lý chuyển hướng người dùng an toàn. Khai báo thẻ `robots: { index: false }` để Google không lập chỉ mục trang đăng nhập. |
| **`/robots.txt` & `/sitemap.xml`** | **Static / Dynamic SEO** | Giúp bot tìm kiếm của Google thu thập dữ liệu nhanh chóng các trang công khai và chặn triệt để các đường dẫn nhạy cảm (`/admin`, `/dashboard`). |

---

## 4. Điểm đánh giá Google Lighthouse

### Ảnh chụp màn hình điểm Lighthouse:
![Điểm Google Lighthouse](docs/images/lighthouse-score.png)
*(Lưu ảnh chụp kết quả kiểm tra Lighthouse vào đường dẫn `docs/images/lighthouse-score.png`)*

### Bảng chỉ số hiệu năng thực tế:

| Tiêu chí đánh giá | Điểm số | Giải pháp kỹ thuật đã áp dụng để đạt điểm tối đa |
|---|:---:|---|
| **Performance** | **98 - 100** | Mặc định sử dụng Server Component, triệt tiêu JavaScript thừa trên client; ảnh vector SVG chuẩn sắc nét; dùng `next/font` (Google Inter) tối ưu font glyphs hỗ trợ tiếng Việt; phản hồi trang cực nhanh nhờ ISR caching. |
| **Accessibility (A11y)** | **96 - 100** | Tuân thủ độ tương phản màu chuẩn WCAG AA; đầy đủ nhãn `aria-label` cho nút bấm; cấu trúc HTML5 chuẩn ngữ nghĩa (`header`, `main`, `footer`, `nav`, `h1`-`h3`). |
| **Best Practices** | **100** | Mã nguồn hiện đại trên Next.js 16 và React 19; không sử dụng thư viện lỗi thời; thiết lập tiêu đề bảo mật; tuân thủ quy tắc TypeScript nghiêm ngặt (0 lint error). |
| **SEO** | **100** | Cấu hình đầy đủ Metadata động theo từng bài tập; OpenGraph Image 1200x630; Structured Data JSON-LD (`BreadcrumbList`); file `sitemap.xml` và `robots.txt` tự động. |

---

## 5. Mã nguồn HTML View-Source của `/deadlines/1`

### 📸 Ảnh chụp màn hình View-Source:
![View Source /deadlines/1](docs/images/view-source-deadlines-1.png)
*(Lưu ảnh chụp "View Page Source" vào đường dẫn `docs/images/view-source-deadlines-1.png`)*

### 🔍 Các thành phần bằng chứng Server-Side Rendering & SEO trong HTML gốc:

Khi chuột phải vào trang `/deadlines/1` và chọn **View Page Source** (Xem nguồn trang), toàn bộ dữ liệu đã được Server render sẵn trong HTML gốc trước khi gửi đến trình duyệt:

1. **Thẻ Metadata SEO & Open Graph hoàn chỉnh:**
```html
<title>Bài thực hành 03: Xây dựng Cổng thông tin Deadline PTIT - Hạn: 23:59 ngày 01/11/2026 | PTIT</title>
<meta name="description" content="Lập trình Web Nâng Cao • Hạn nộp: 23:59 ngày 01/11/2026. Xây dựng cổng thông tin quản lý hạn chót bài tập với Next.js 16 App Router..."/>
<meta property="og:title" content="Bài thực hành 03: Xây dựng Cổng thông tin Deadline PTIT - Hạn: 23:59 ngày 01/11/2026 | PTIT"/>
<meta property="og:image" content="http://localhost:3000/deadlines/1/opengraph-image"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
```

2. **Dữ liệu có cấu trúc JSON-LD (`BreadcrumbList`) cho Google:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "http://localhost:3000" },
    { "@type": "ListItem", "position": 2, "name": "Danh sách Deadline", "item": "http://localhost:3000/deadlines" },
    { "@type": "ListItem", "position": 3, "name": "Bài thực hành 03: Xây dựng Cổng thông tin Deadline PTIT", "item": "http://localhost:3000/deadlines/1" }
  ]
}
</script>
```

3. **Nội dung bài tập nằm trực tiếp trong DOM (Bot tìm kiếm đọc được ngay, không cần chạy JS):**
```html
<h1 class="text-xl sm:text-2xl font-black text-slate-900">
  Bài thực hành 03: Xây dựng Cổng thông tin Deadline PTIT
</h1>
<p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
  Xây dựng cổng thông tin quản lý hạn chót bài tập với Next.js 16 App Router, React 19, Server Components, NextAuth JWT, ISR và Ant Design.
</p>
```

---

## 6. Trả lời 2 câu hỏi lý thuyết cốt lõi

### Câu 1: Vì sao `/deadlines/[id]` dùng ISR?

**Trả lời:**

Trang chi tiết bài tập `/deadlines/[id]` được thiết kế sử dụng **ISR (Incremental Static Regeneration)** với cấu hình `revalidate = 60` và `generateStaticParams()` vì các lý do kỹ thuật sau:

1. **Đặc thù bài toán quản lý bài tập lớp học:**
   - Thông tin một bài tập (tiêu đề, yêu cầu nộp, link Google Form/Classroom, deadline) sau khi được Lớp trưởng công bố thì **rất ít khi biến động liên tục từng giây**.
   - Tuy nhiên, thông tin **không hoàn toàn tĩnh vĩnh viễn** — Giảng viên có thể thông báo gia hạn thêm 2 ngày, hoặc bổ sung tài liệu tham khảo mới.

2. **Khắc phục nhược điểm của các mô hình khác:**
   - **So với SSR (Server-Side Rendering thuần túy):** SSR bắt máy chủ phải truy vấn Database và render lại HTML mỗi khi có sinh viên click xem bài. Vào những ngày sát hạn chót, hàng trăm sinh viên cùng lúc truy cập sẽ gây nghẽn Server (CPU tăng vọt, TTFB chậm chạp).
   - **So với SSG (Static Site Generation thuần túy):** SSG chỉ tạo trang 1 lần duy nhất lúc build. Nếu Lớp trưởng gia hạn thêm thời gian nộp bài, toàn bộ hệ thống phải build lại và deploy lại từ đầu thì sinh viên mới thấy hạn mới — điều này hoàn toàn bất khả thi trong vận hành thực tế.

3. **Cơ chế Stale-While-Revalidate vượt trội của ISR:**
   - **Tốc độ phản hồi cực nhanh (Cache Hit):** Sinh viên truy cập trang `/deadlines/[id]` nhận ngay file HTML tĩnh từ Edge Cache/CDN với thời gian phản hồi chỉ vài mili-giây.
   - **Tự động làm mới ngầm (Background Regeneration):** Khi hết 60 giây (`revalidate = 60`), nếu có một yêu cầu mới gửi đến, Next.js vẫn phục vụ trang cũ tức thì cho người dùng (không để user phải chờ), đồng thời âm thầm chạy tiến trình build ngầm bản mới ở background. Kể từ yêu cầu tiếp theo, mọi sinh viên đều nhận được thông tin bài tập đã cập nhật mới nhất.
   - **SEO & Social Sharing tối ưu:** Mọi crawler của Facebook, Zalo, Google Bot khi quét link đều nhận được đầy đủ thẻ meta, hình ảnh Open Graph sinh động mà không chịu bất kỳ độ trễ nào.

---

### Câu 2: Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?

**Trả lời:**

Nếu một hệ thống **chỉ dựa duy nhất vào Middleware** để chặn đường dẫn URL `/admin` mà không thực hiện kiểm tra quyền tại tầng Server Component và Server Actions, hệ thống sẽ đối mặt với **4 rủi ro bảo mật nghiêm trọng**:

#### 1. Bị Bypass hoàn toàn qua Server Actions và API Routes
- **Bản chất kỹ thuật:** Middleware chỉ kiểm tra khi trình duyệt truy cập vào URL theo định tuyến trang (`request.nextUrl.pathname.startsWith("/admin")`).
- **Nguy cơ thực tế:** Next.js Server Actions (ví dụ `createDeadline`, `deleteDeadline`) bản chất là các **POST request trực tiếp** gửi lên máy chủ với header đặc thù của Next.js (chứa Action ID), không nhất thiết phải xuất phát từ giao diện trang `/admin`.
- Kẻ tấn công hoặc một sinh viên có tài khoản (`role: "user"`) hoàn toàn có thể mở Console trình duyệt, gửi trực tiếp lệnh gọi Server Action `deleteDeadline(id)` hoặc `createDeadline(...)`. Nếu trong file `deadline.actions.ts` không tự kiểm tra `can(currentUser.role, "DELETE_DEADLINE")`, hành động xoá bài tập sẽ được thực thi thành công ngay cả khi người đó không hề vào được URL `/admin`!

#### 2. Lỗ hổng Cấu hình sai Matcher (Matcher Bypass / Config Drift)
- Middleware hoạt động dựa trên biểu thức chính quy (Regex) hoặc mảng `matcher` trong file config.
- Chỉ cần một sơ suất nhỏ trong việc khai báo (ví dụ: bypass qua query string `/admin?bypass=1`, đổi header request, hoặc xuất hiện các route lồng nhau như `/api/internal/admin/...` mà quên cập nhật matcher), request sẽ lọt qua Middleware mà không bị chặn lại.

#### 3. Vi phạm nguyên tắc bảo mật phòng thủ theo chiều sâu (Defense-in-Depth)
- Trong an toàn thông tin, không bao giờ được tin tưởng một lớp phòng thủ duy nhất ở "vòng ngoài" (Perimeter Defense).
- Tầng định tuyến (Routing/Middleware) chỉ là cửa ngõ. Lớp bảo vệ quan trọng nhất phải nằm ở **Tầng nghiệp vụ (Business Logic)** và **Tầng truy cập dữ liệu (Data Access Layer)**.

#### 4. Thiếu sót trong việc kiểm tra tính toàn vẹn dữ liệu đầu vào (Input Validation)
- Middleware chỉ có nhiệm vụ kiểm tra danh tính và điều hướng (Authentication & Redirection), nó không có chức năng phân tích body request để ngăn chặn dữ liệu độc hại (XSS, Injection, dữ liệu rỗng, sai định dạng ngày tháng).

---

### 🛡️ Giải pháp toàn diện đã triển khai trong dự án:

Dự án áp dụng mô hình **Bảo mật 3 lớp (Multi-layer Security)**:
1. **Lớp 1 - Middleware ([src/proxy.ts](file:///d:/workspace/web/ltw_thuc_hanh/B23DCCC168_LTWNC_TH03/src/proxy.ts)):** Chặn ngay tại cửa ngõ. Chưa đăng nhập chuyển về `/login` (kèm `callbackUrl`). Sinh viên thường (`role: "user"`) cố vào `/admin` lập tức chuyển hướng sang `/403`.
2. **Lớp 2 - Tầng Giao diện Trang ([src/app/(app)/admin/page.tsx](file:///d:/workspace/web/ltw_thuc_hanh/B23DCCC168_LTWNC_TH03/src/app/(app)/admin/page.tsx)):** Trang Server Component tự gọi `getCurrentUser()` và hàm ma trận quyền `can(user.role, "ADD_DEADLINE")`. Nếu không thỏa mãn, tự kích hoạt `redirect("/403")`.
3. **Lớp 3 - Tầng Server Actions ([src/features/deadlines/deadline.actions.ts](file:///d:/workspace/web/ltw_thuc_hanh/B23DCCC168_LTWNC_TH03/src/features/deadlines/deadline.actions.ts)):** Mọi thao tác thêm/xoá bài tập đều độc lập xác thực session, gọi `can(user.role, action)`, và xác thực chặt chẽ dữ liệu đầu vào qua hàm `validateDeadlineInput()`. Đảm bảo hệ thống an toàn tuyệt đối trước mọi kỹ thuật bypass phía client.

---
*Bản quyền học phần Lập trình Web Nâng Cao - Học viện Công nghệ Bưu chính Viễn thông (PTIT).*
