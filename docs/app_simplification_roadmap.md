# 📱 Cinematic English | Full App Simplification Roadmap
**Goal:** Tối giản hóa toàn bộ ứng dụng, hướng tới trải nghiệm mobile-first, dễ hiểu, gây nghiện và tập trung 100% vào giá trị cốt lõi: **Movie Shadowing + AI Pronunciation Feedback**.

---

## 🏆 Ưu Tiên 1: Trình Phát Bài Học (Lesson Screen)
*Độ tác động (UX Impact): Rất Cao - Đây là lõi của sản phẩm.*

**Vấn đề hiện tại:** Trình phát quá lộn xộn với thanh tiến trình nhiều bước, chữ giải thích nhỏ, bị trộn lẫn các dạng bài tập không liên quan (chép chính tả, điền từ).
**Hành động đơn giản hóa (The Simplification):**
1.  **Chế độ Màn hình đơn (Single-Screen Mode):** Loại bỏ thanh cuộn. Video/âm thanh nằm nửa trên màn hình, nửa dưới là Subtitle và Microphone.
2.  **Tập trung vào 4 điểm chạm duy nhất:**
    *   **Phụ đề (Subtitle):** Chữ khổng lồ (Large/XL font size), canh giữa màn hình, in đậm.
    *   **Nút Nghe (Play):** To, rõ ràng.
    *   **Nút Nói (Record):** Nút duy nhất nổi bật nhất màn hình (Primary CTA) với màu gradient nổi.
    *   **AI Feedback:** Chỉ xuất hiện sau khi nói xong. Thay vì hiện một bảng điểm phức tạp, chỉ cần hiện: *"85% - Tuyệt vời! Bạn chỉ sai ở từ [X]."*.
3.  **Tự động chuyển bài (Auto-advance):** Không bắt người dùng bấm "Tiếp theo". Sau khi đọc đúng, hệ thống tự động khen và chuyển sang câu tiếp.

---

## 🏆 Ưu Tiên 2: Bảng Điều Khiển (Dashboard)
*Độ tác động (UX Impact): Cao - Điểm rơi đầu tiên của người dùng khi đăng nhập.*

**Vấn đề hiện tại:** Màn hình Dashboard (`dashboard/page.tsx`) bị chia thành 4 tab (Trung tâm, Học tập, Tiến trình, Cộng đồng) cùng với thanh sidebar chứa quá nhiều lối tắt thừa (Cổng giáo viên, Lớp học học sinh, Khảo thí).
**Hành động đơn giản hóa (The Simplification):**
1.  **Xóa bỏ hoàn toàn Tabs:** Không bắt người dùng chuyển tab. Mọi thứ cuộn trên 1 trang duy nhất.
2.  **Làm sạch UI (Widget Purge):** Xóa bỏ các block "Phòng tính năng", "Tip của ngày", "Cổng giáo viên", "Lớp học".
3.  **Cấu trúc lại với 4 phần lõi:**
    *   **Streak (Đỉnh trang):** Biểu tượng ngọn lửa và chuỗi ngày học liên tiếp để tạo thói quen (Addiction hook).
    *   **Continue Learning (Nút bấm to nhất):** Một thẻ (Card) duy nhất hiển thị cảnh phim đang học dở và nút "Học tiếp". 
    *   **Phát âm (Pronunciation Progress):** Một thanh tiến trình đơn giản (Ví dụ: Độ tự tin phát âm: 80% ➔ 85%).
    *   **Lịch sử (Recent Lessons):** Danh sách 3 cảnh phim vừa hoàn thành để người dùng có thể nghe lại.

---

## 🏆 Ưu Tiên 3: Thanh Điều Hướng (Navbar)
*Độ tác động (UX Impact): Khá - Ảnh hưởng đến sự tập trung.*

**Vấn đề hiện tại:** Menu rườm rà (Luyện nhanh, Thư viện, Học tập, Lớp học, HLV Phát Âm) khiến học viên không biết nên bấm vào đâu.
**Hành động đơn giản hóa (The Simplification):**
1.  **Mobile-first Bottom Tab (Đề xuất):** Thay vì thanh menu ẩn trên mobile, chuyển thành thanh Tab ở đáy màn hình với 3 nút duy nhất:
    *   `Khám phá` (Chọn phim mới)
    *   `Học tiếp` (Trang chủ/Dashboard)
    *   `Cá nhân` (Hồ sơ & Streak)
2.  **Top Navbar siêu sạch:** Chỉ giữ lại Logo và nút Nâng cấp Gói PRO (Primary CTA) để chốt sales. Xóa bỏ hoàn toàn các link chuyển trang không cần thiết.

---

## 🏆 Ưu Tiên 4: Hệ Thống Thị Giác (Visual System)
*Độ tác động (UX Impact): Trung bình - Cải thiện tốc độ và sự dễ chịu khi đọc.*

**Vấn đề hiện tại:** Quá nhiều hiệu ứng Blur (kính mờ), Gradient đa sắc, và hiệu ứng nổi (floating animations) làm giảm độ tương phản của chữ và làm chậm máy điện thoại cũ.
**Hành động đơn giản hóa (The Simplification):**
1.  **Dọn dẹp hiệu ứng (De-cluttering):** Tắt các vòng sáng mờ (glow orbs) vô nghĩa. 
2.  **Tăng độ tương phản (Contrast):** Sử dụng nền tối tuyền (Solid Dark) thay vì kính mờ (Glassmorphism) phía sau các đoạn văn bản quan trọng. 
3.  **Touch Targets (Mục tiêu chạm):** Đảm bảo mọi nút bấm, đặc biệt là nút Mic và Play, có chiều cao tối thiểu 56px để ngón tay cái thao tác dễ dàng trên màn hình điện thoại mà không bị trượt.
4.  **Hệ thống chữ (Typography):** Hạn chế in nghiêng (italic) và in hoa toàn bộ (ALL CAPS) ở các đoạn dài. Sử dụng font sans-serif rõ ràng với độ lớn chữ (font-size) tối thiểu 16px trên mobile.

---

## 🚀 Luồng Trải Nghiệm Mục Tiêu (The "No-Brainer" Flow)
Bất cứ ai vào app cũng sẽ rơi vào vòng lặp gây nghiện này:
**Mở App ➔ Thấy Chuỗi Streak ➔ Bấm "Học Tiếp" ➔ Xem Video ➔ Nhại Giọng (Mic) ➔ Nhận Lời Khen (AI) ➔ Vòng lặp tiếp tục.** 

Không bao giờ người dùng phải thắc mắc: *"Mình nên nhấn vào đâu tiếp theo?"*
