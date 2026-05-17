# Báo Cáo Triển Khai: Hệ Thống Phân Quyền (RBAC) & Monetization

## 1. Vá Lỗi Phân Quyền & Bảo Mật Tuyến (Leaked Routes Fixed)
- **Vấn đề trước đây**: Không có rào cản ngăn Guest truy cập `/chat`, `/learn`, `/classroom`. Teachers và Admins dùng chung hệ thống điều hướng với học viên, gây rối loạn UX và rò rỉ dữ liệu bảng điều khiển.
- **Giải pháp**: Viết lại hoàn toàn `middleware.ts`.
  - Chặn triệt để Guest khỏi tất cả các trang nội bộ (chuyển hướng về `/login`).
  - Phân tách riêng biệt tuyến truy cập:
    - `Student`: Chặn khỏi `/admin` và `/teacher`.
    - `Teacher`: Có thể truy cập `/teacher` (chặn khỏi `/admin`).
    - `Admin`: Quyền truy cập tối cao, không bị ảnh hưởng bởi giới hạn.
- **Kết quả**: Bảo mật tuyệt đối, tuân thủ chặt chẽ ranh giới vai trò (Role-Based Boundaries).

## 2. Ma Trận Quyền Hạn (Permission Matrix)
Hệ thống Navbar đã được cấu hình động theo Role:
- **Guest**: Chỉ thấy `Trang chủ`, `Thư viện`. Kêu gọi hành động: `Đăng nhập`, `Bắt đầu ngay`.
- **Student**: Thấy `Luyện nhanh`, `Thư viện`, `Học tập`, `Lớp học`, `HLV Phát Âm`. Kêu gọi hành động: `Bảng điều khiển`, `Gói Pro`.
- **Teacher**: Thấy `Quản lý Lớp`, `Giao bài`. Kêu gọi hành động: `Bảng điều khiển`. Không bị vướng bận bởi tính năng của học sinh.
- **Admin**: Thấy `Bảng điều khiển`, `Thống kê & Đo lường`. Quyền thao tác telemetry.

## 3. Kiến Trúc Giới Hạn Tính Năng (Feature Gating Architecture)
- Đã thiết lập module tập trung `src/lib/auth/rbac.ts`.
- **Hệ thống Quota (Quota Checker)**:
  - Hàm `checkSpeakingQuota(userId)` được tích hợp trực tiếp vào Server Action của trợ lý AI.
  - Tự động đếm số lượng tệp ghi âm người dùng đã upload lên Supabase Storage trong ngày.
  - So khớp với `PLAN_LIMITS` (`free` giới hạn 5 lần/ngày, `pro` không giới hạn).
- **Hệ thống Entitlement**:
  - Gói Free: Bị giới hạn số lần thu âm, số phút trò chuyện, không có Spaced Repetition nâng cao.
  - Gói Pro: Không giới hạn tất cả các tính năng.

## 4. Trạng Thái Mở Rộng SaaS (SaaS Scalability Status)
- **Tách biệt Data**: Profile chứa trường `role` và `plan`.
- **Dễ dàng mở rộng**: Khi thêm gói mới (ví dụ `enterprise`), chỉ cần định nghĩa lại `PLAN_LIMITS` mà không làm vỡ kiến trúc cũ.
- **Linh hoạt UI**: Các thành phần hệ thống phản ứng ngay lập tức với role mới thông qua Server Client.

## 5. Mức Độ Sẵn Sàng Kiếm Tiền (Monetization Readiness)
- Đã khóa phễu: Người dùng miễn phí chạm trần (Hit Paywall) sẽ nhận được thông báo yêu cầu nâng cấp gói Pro bằng ngôn ngữ thân thiện, chuẩn giáo dục Việt Nam.
- Lời nhắc nâng cấp (Upgrade Prompts) xuất hiện tinh tế ngay trong hệ thống thông báo lỗi AI (VD: "Gói Học viên Free giới hạn 5 lần chấm điểm phát âm mỗi ngày. Nâng cấp Pro để luyện tập không giới hạn!").
- Nút CTA mua `Gói Pro` luôn hiển thị khéo léo trên Navbar với học viên.

## 6. Lỗ Hổng Bảo Mật Đã Xóa Bỏ
- **Broken Access Control (BAC)**: Ngăn chặn Guest gọi API và truy cập Dashboard.
- **Tấn công lạm dụng băng thông AI**: Bằng cách đếm file lưu trữ trên Supabase theo ngày, ta chặn đứng nguy cơ một user free spam API của OpenAI thông qua Server Action.
- Hủy bỏ các từ lóng SaaS rườm rà, đưa giao diện về chuẩn môi trường giáo dục (Mượt mà, văn minh, và dễ sử dụng cho học sinh trung học Việt Nam).
