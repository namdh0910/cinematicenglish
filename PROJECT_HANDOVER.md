# HỒ SƠ BÀN GIAO DỰ ÁN & TỔNG QUAN HỆ THỐNG
## 🎬 CINEMATIC ENGLISH — PHIÊN BẢN 2.0 (PRODUCTION-READY)

> [!IMPORTANT]  
> **Định vị sản phẩm**: **TikTok + Duolingo + ELSA Speak** (Học Tiếng Anh qua phim bom tấn với phản xạ nói tự nhiên, chuỗi ngày học Aura đầy động lực, và giáo viên AI chấm điểm tức thì).  
> **Ưu tiên giai đoạn**: Tập trung 100% trải nghiệm học viên (**STUDENT ONLY**). Đã đóng băng hoàn toàn hệ thống giáo viên/quản lý lớp học cũ (`teacher__FROZEN_DO_NOT_BUILD`).

---

## 1. 🗺️ DANH SÁCH ROUTES & CÁC TRANG HIỆN TẠI (ROUTES MAP)

Hệ thống Next.js sử dụng App Router (`src/app/`) với các trang chức năng đã hoàn thiện và chạy ổn định:

| Đường dẫn (Route) | Chức năng chính | Trạng thái giao diện |
| :--- | :--- | :--- |
| `/` | **Landing Page chính**: Giới thiệu phương pháp, bảng giá gói PRO và khối học thử tương tác ngay lập tức (Demo trích đoạn The Godfather). | **Hoàn hảo** (Đã căn giữa cân đối, tương thích mobile/desktop, không lỗi đè debug). |
| `/login` | **Đăng nhập**: Xác thực tài khoản qua Supabase Auth thật, ghi nhớ session, hỗ trợ chuyển hướng thông minh sau khi đăng nhập (`?from=...`). | **Đã sửa** (Nhãn input hiển thị `block` ngăn nắp, không chồng chữ). |
| `/signup` | **Đăng ký**: Tạo tài khoản mới, phân luồng nhanh Học sinh/Giáo viên, đo lường độ mạnh mật khẩu và gửi email xác nhận. | **Đã sửa** (Giao diện thẻ co giãn linh hoạt, không bị bóp nghẹt chiều cao). |
| `/dashboard` | **Trung tâm học viên**: Lời chào AI cá nhân hóa, hiển thị chuỗi streak Momentum Aura (ngọn lửa), lịch sử nói, bảng xếp hạng và các phím tắt nhanh. | **Hoàn hảo** (Đã căn giữa tuyệt đối, đồng bộ hóa tuyệt đối với thanh Navbar). |
| `/stories` | **Thư viện Stories**: Kho lưu trữ trích đoạn phim theo dạng lưới (Grid) chuẩn Netflix, phân loại độ khó, hiển thị tiến trình hoàn thành. | **Hoàn thiện** (Bố cục 3 cột responsive mượt mà). |
| `/stories/[id]` | **Chi tiết Story**: Danh sách các phân cảnh (scenes) và bài học (lessons) nhỏ đi kèm của câu chuyện đó. | **Hoàn thiện**. |
| `/learn/lesson/[id]`| **Trình học cốt lõi (Heart of App)**: Trình phát phụ đề phim, ghi âm giọng nói, phân tích tần số mic thực tế (real frequency waveform) và chấm điểm AI. | **Hoàn thiện** (Đã tách biệt mã nguồn UI khỏi cấu trúc hạ tầng AI của bên thứ ba). |
| `/demo` | **Thử thách học thử**: Cho phép người dùng chưa đăng ký trải nghiệm nhanh 1 lượt luyện nói và nhận feedback từ AI. | **Hoàn thiện**. |
| `/coach` | **Luyện nói tự do**: Trò chuyện trực tiếp và nhận các lời khuyên phát âm, ngữ điệu từ Giáo viên AI. | **Hoàn thiện**. |
| `/admin` | **Trang quản trị**: Bảng thống kê doanh thu, quản lý danh sách người dùng, quản trị kho học liệu (Stories, Curriculum, Phân cảnh). | **Hoàn thiện** (Dành cho quản trị viên hệ thống). |

---

## 2. 🗂️ CẤU TRÚC THƯ MỤC CỐT LÕI (SHRINK DIRECTORY TREE)

Cấu trúc thư mục của dự án đã được mô-đun hóa cực kỳ tinh gọn, giúp lập trình viên mới vào dễ dàng nắm bắt:

```text
cinematic-english/
├── handover_media/                  # 📸 BỘ ẢNH CHỤP GIAO DIỆN THỰC TẾ TRÊN PRODUCTION
│   ├── homepage_centered.png        # Trang chủ căn giữa hoàn mỹ, không lỗi che debug
│   ├── dashboard_flow.png           # Giao diện Dashboard học viên với chuỗi lửa Aura
│   └── signup_page.png              # Biểu mẫu đăng ký giãn dòng chuẩn Premium
│
├── supabase/
│   └── migrations/
│       ├── 20260517_monetization.sql     # Schema phân quyền, hóa đơn và gói PRO
│       └── 20260518_full_production.sql  # Schema 12 bảng cốt lõi (profiles, streaks, lessons, attempts...)
│
└── src/
    ├── app/                         # 📁 NEXT.JS PAGES & ROUTING (APPLICATIONS)
    │   ├── globals.css              # Hệ thống CSS Design System (Glassmorphism, Neon Glow)
    │   ├── layout.tsx               # Khung layout gốc (bọc Adaptive atmosphere)
    │   ├── page.tsx                 # Trang chủ (/) và Demo Player Godfather
    │   ├── dashboard/               # Trang tổng quan học tập học viên (/dashboard)
    │   ├── stories/                 # Thư viện stories dạng Netflix grid (/stories)
    │   ├── learn/                   # Trình phát bài học & Luyện nói AI (/learn)
    │   └── teacher__FROZEN.../      # Thư mục Giáo viên (ĐÃ ĐÓNG BĂNG CHIẾN LƯỢC)
    │
    ├── components/                  # 📁 REUSABLE UI COMPONENTS
    │   ├── ui/                      # Các khối atomic: Card, Button, Badge, Waveform
    │   ├── coach/                   # Cấu phần AI Coach: VoiceRecorder (Mic thật), AICoachPanel
    │   ├── player/                  # Trình phát video phụ đề, tua chậm, tua nhanh
    │   └── Navbar.tsx               # Thanh điều hướng đa trạng thái (Khách / Học viên / PRO / Streak)
    │
    ├── context/                     
    │   └── AdaptiveContext.tsx      # Trình quản lý không khí học tập (Ambitious, Focus, Momentum...)
    │
    ├── features/                    # 📁 DOMAIN-DRIVEN FEATURES
    │   └── speaking/                # Engine luyện nói chuyên sâu (hooks, components, types)
    │
    └── lib/                         # 📁 BACKEND CORE & INFRASTRUCTURE LAYER
        ├── supabase/                # Khởi tạo Supabase Client (Browser/Server)
        ├── ai/                      # Trạm trung chuyển AI (Whisper STT, Scoring, TTS, Providers)
        ├── monetization/            # Hệ thống quản lý hạn ngạch (Quotas) và Gói PRO
        └── observability/           # Cấu phần giám sát telemetry, sự kiện, thời lượng nói
```

---

## 3. 🚀 TÓM TẮT NHỮNG GÌ ĐÃ ĐƯỢC XÂY DỰNG (TECHNICAL CAPABILITIES)

### A. Core Backend & Database (Supabase Production-Grade)
* **Xác thực an toàn (Auth & Session)**: Đăng nhập/Đăng xuất thời gian thực, tự động giải phóng và dọn dẹp các session lỗi, không kẹt cookie cũ.
* **Cơ sở dữ liệu hoàn chỉnh**: Đã triển khai SQL Schema tối ưu hóa chỉ số, khóa ngoại và RLS (Row Level Security):
  * `profiles`: Lưu thông tin học viên và gói dịch vụ.
  * `daily_streaks`: Quản lý chuỗi ngày học Aura tự động tính toán thời gian.
  * `speaking_attempts`: Lưu lịch sử phát âm thực tế để vẽ biểu đồ tiến trình.
  * `quota_usage`: Bảo vệ tài nguyên AI, giới hạn lượt nói hàng ngày cho tài khoản Free.

### B. Core Speaking Engine (Trái tim của ứng dụng)
* **Real-time Web Audio API**: Component [VoiceRecorder.tsx](file:///d:/Antigravity_Projects/cinematic-english/src/components/coach/VoiceRecorder.tsx) thu âm trực tiếp từ Microphone của thiết bị và phân tách tần số giọng nói thành sóng âm chuyển động sinh động (Waveform) thay vì dùng sóng giả lập.
* **AI Feedback Cách ly**: Các thành phần giao diện không trực tiếp gọi API OpenAI/Whisper để tránh lộ Key và dễ dàng thay đổi nhà cung cấp AI trong tương lai bằng cách bọc qua lớp trung gian `lib/ai/`.

### C. Design System & UX (Cinematic UI)
* **Atmosphere Layer (Adaptive Mode)**: Tích hợp hiệu ứng thay đổi màu sắc và tốc độ hoạt ảnh giao diện dựa trên tâm trạng học tập của học sinh (ví dụ: *Ambitious* bật tông màu Gold rực lửa, *Focus* giảm nhiễu thị giác tối đa).
* **Căn chỉnh hoàn mỹ**: Các trang đều sử dụng cấu trúc lưới đồng bộ, đảm bảo nội dung chính luôn hiển thị ở trung tâm màn hình, không bị lệch hoặc chồng chéo chữ trên bất kỳ độ phân giải nào.

---

## 4. 📝 LỊCH SỬ HỘI THOẠI & QUYẾT ĐỊNH CHIẾN LƯỢC (DECISION LOG)

Dự án đã trải qua các cột mốc tinh chỉnh chiến lược cực kỳ quan trọng, nhà phát triển tiếp theo cần **tuân thủ nghiêm ngặt**:

1. **Giai đoạn 1: Định hình Trọng tâm (Prioritize Student Experience)**
   * *Quyết định*: Đóng băng toàn bộ luồng giáo viên, dashboard giáo viên, bài tập về nhà, chấm điểm lớp học.
   * *Lý do*: Tập trung kiểm chứng mức độ giữ chân học viên (Retention) và thói quen luyện nói hàng ngày trước khi mở rộng bán gói doanh nghiệp/trường học.

2. **Giai đoạn 2: Tái cấu trúc Speaking Engine (Modularization Freeze)**
   * *Quyết định*: Tách tệp tin God Component `LessonPlayerClient.tsx` cũ thành cấu trúc Domain-Driven `features/speaking/` và cách ly toàn bộ logic chấm điểm AI (`lib/ai/`).
   * *Lý do*: Đảm bảo giao diện UI không bị phình to và dễ bảo trì khi tích hợp các mô hình AI mới.

3. **Giai đoạn 3: Hiện thực hóa Dữ liệu (Supabase Integration)**
   * *Quyết định*: Loại bỏ hoàn toàn dữ liệu giả (Mock data), đưa toàn bộ lịch sử học tập, streak lửa, thông tin gói PRO và lưu trữ attempts vào bảng Supabase thật.

4. **Giai đoạn 4: Cân bằng & Tinh chỉnh Layout (Production Polish)**
   * *Quyết định*: Sửa toàn bộ các điểm lệch lề trái 40% trên Desktop, căn giữa card demo trang chủ, căn giữa dashboard học viên, đổi toàn bộ các nhãn form `label` sang `block` để đảm bảo hiển thị hoàn hảo trên iOS/Android/Chrome.

---

## 5. 📸 HƯỚNG DẪN SỬ DỤNG BỘ ẢNH GIAO DIỆN (HANDOVER MEDIA)

Để gửi cho đối tác hoặc nhà phát triển khác xem nhanh sản phẩm thực tế mà không cần khởi chạy máy chủ:
* Vui lòng truy cập thư mục [handover_media/](file:///d:/Antigravity_Projects/cinematic-english/handover_media/) trong thư mục gốc.
* Thư mục chứa 3 ảnh chụp độ nét cao tuyệt đẹp ghi nhận trực quan giao diện thực tế trực tuyến:
  1. `homepage_centered.png`: Trang chủ chính thức với Khối học thử The Godfather được căn giữa sang trọng và cân đối.
  2. `dashboard_flow.png`: Trang Dashboard học tập thực tế với chuỗi lửa Aura ngày học của học viên và thanh tùy chọn Adaptive Engine.
  3. `signup_page.png`: Biểu mẫu Đăng ký tài khoản mới được căn chỉnh giãn cách cực kỳ chuyên nghiệp.

---
*Tài liệu được biên soạn tự động và đồng bộ bởi trợ lý AI Antigravity.*
