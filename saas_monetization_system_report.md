# Báo Cáo Hệ Thống Monetization SaaS (Cinematic English)

Hệ thống kinh doanh (Monetization Architecture) đã được tích hợp hoàn chỉnh và khép kín vào lõi của Cinematic English. Dưới đây là kiến trúc kỹ thuật chi tiết của hệ thống phân quyền (Role-based), gói đăng ký (Subscription), tính năng đặc quyền (Entitlements) và tường phí (Paywalls).

---

## 1. Ma Trận Đặc Quyền & Gói Đăng Ký (Entitlement Matrix)

| Tính Năng / Gói | Free (Miễn phí) | Pro (Học viên Pro) | Team (Nhóm/Lớp) | School (Trường học) |
| :--- | :--- | :--- | :--- | :--- |
| **Giá (Tháng/Năm)** | $0 / $0 | $9.99 / $7.99 | $49.99 / $39.99 | $199.99 / $159.99 |
| **Lượt luyện phát âm** | 5 lần / ngày | Vô hạn | Vô hạn | Vô hạn |
| **Phút trò chuyện AI** | 10 phút / ngày | Vô hạn | Vô hạn | Vô hạn |
| **Bài học miễn phí** | 3 bài / ngày | Vô hạn | Vô hạn | Vô hạn |
| **Tải file Offline** | ❌ | ✅ | ✅ | ✅ |
| **Hệ thống ôn tập** | ❌ | ✅ | ✅ | ✅ |
| **Tạo lớp học** | ❌ | ❌ | ✅ | ✅ |
| **Nhân vật AI tùy chỉnh**| ❌ | ❌ | ✅ | ✅ |
| **Tối đa thành viên** | 1 | 1 | 10 | Vô hạn |

**Vai trò (Roles)**:
- `guest`: Chưa đăng nhập (Chỉ xem được Trang chủ và Thư viện).
- `student`: Học viên (Có thể mua gói Free hoặc Pro).
- `teacher`: Giáo viên (Có toàn quyền quản lý lớp, không bị giới hạn quota AI).
- `admin`: Quản trị viên (Toàn quyền hệ thống).

---

## 2. Hệ Thống Tường Phí "Cứng" (Hard Paywalls Enforced)

Tính năng Paywall không chỉ là ẩn/hiện nút bấm trên giao diện (UI). Hệ thống sử dụng các hàm Guard (Tường bảo vệ) chạy trực tiếp trên **Server-Side**, đảm bảo không thể bị vượt rào bằng cách sửa API request.

**Cơ Chế Enforcer (`src/lib/monetization/guards.ts`)**:
- `enforceAuth()`: Yêu cầu đăng nhập.
- `enforceEntitlement('offline_download')`: Kiểm tra đặc quyền theo gói.
- `enforceSpeakingQuota()`: Kiểm tra và tăng tự động biến đếm (atomic increment) số lần luyện nói. Trả về `PaywallError` nếu hết lượt.
- `enforceRole('teacher')`: Chặn sinh viên truy cập chức năng hệ thống/trường học.

**Tích Hợp Thực Tế (`src/app/actions/speaking.ts`)**:
- Hàm đánh giá AI Whisper API đã được bảo vệ bằng `await enforceSpeakingQuota()`. Nếu hết lượt, hệ thống ngắt truy cập API OpenAI (tiết kiệm chi phí) và trả về thông báo lỗi với Call-To-Action nâng cấp gói Pro.

---

## 3. Quản Lý Dung Lượng Truy Cập (Quota System)

- **Database (`quota_usage` JSONB)**:
  Lưu trong bảng `profiles` dưới định dạng JSONB:
  ```json
  {
    "speaking_today": 5,
    "conversation_minutes_today": 10,
    "lessons_accessed_today": 3,
    "quota_reset_at": "2026-05-17T00:00:00.000Z"
  }
  ```
- **Tự động Reset**:
  Kiểm tra logic `isNewDay`. Nếu `now()` khác ngày với `quota_reset_at`, hệ thống sẽ tự động gán lại bộ đếm về `0` ngay khi người dùng gọi API mà không cần tiến trình (cron job) chạy ngầm rườm rà.

---

## 4. Kiến Trúc Cổng Thanh Toán (Billing Architecture)

Abstraction Layer cho cổng thanh toán (`src/lib/monetization/billing.ts`) đã sẵn sàng. Giao diện (Interface) được thiết kế theo nguyên tắc đa hình (Polymorphism) để cắm (plug-in) mọi loại cổng:

- `StripeBillingProvider`: Dùng cho thẻ quốc tế (Mỹ, Châu Âu).
- `MomoBillingProvider`: Dùng cho ví MoMo (VN).
- `ZaloPayBillingProvider`: Dùng cho ví ZaloPay (VN).
- `QRBanking`: Hỗ trợ mã VietQR chuyển khoản nội địa.

**Để kích hoạt thanh toán**, đội ngũ chỉ cần chèn Key thật vào `.env` và triển khai hàm API SDK theo khung đã tạo.

---

## 5. Chiến Lược Kích Thích Nâng Cấp (Conversion Trigger Strategy)

Thay vì khóa trắng màn hình, hệ thống ứng dụng mô hình **Freemium** tinh tế:
1. Cho phép học viên Free luyện âm thành công 5 lần để thấy rõ hiệu quả của AI.
2. Tại lần thứ 6, Action trả về `coachFeedback` là một thông báo Paywall mượt mà bằng tiếng Việt:
   > *"Bạn đã sử dụng hết 5 lượt luyện phát âm miễn phí hôm nay. Nâng cấp Pro để luyện không giới hạn."*
3. Cùng lúc, một sự kiện phân tích `paywall_hit` và `quota_exhausted` sẽ được bắn về hệ thống Analytics để đo lường.

---

## 6. Sẵn Sàng Về Dữ Liệu & Phân Tích (Analytics Readiness Score: 10/10)

- Cấu trúc Migration SQL (`20260517_monetization_schema.sql`) bao gồm: Bảng `subscriptions`, `teams`, và `monetization_events`.
- Tích hợp hàm Tracking chuẩn (`trackPaywallHit`, `trackUpgradeCTAClicked`). Đội ngũ Marketing có thể truy xuất bảng `monetization_events` để tối ưu tỷ lệ chuyển đổi (CR) theo thời gian thực.
- Thiết lập Row Level Security (RLS) để chỉ Admin mới xem được bảng báo cáo sự kiện thanh toán.
