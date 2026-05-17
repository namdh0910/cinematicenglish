# 🎙️ KIẾN TRÚC ĐƯỜNG ỐNG XỬ LÝ PHÁT ÂM AI (SPEAKING AI PIPELINE)
*Phase D — Real-time Speech-to-Text & AI Cadence Analytics*

> [!IMPORTANT]
> Tài liệu này được thiết lập bởi CTO & Senior SaaS Production Engineer của Cinematic English, quy chuẩn hóa quy trình tiếp nhận tệp tin ghi âm trực tiếp từ trình duyệt, lưu trữ đám mây, đưa vào hàng đợi xử lý AI (Whisper/Phoneme Matcher) và chu kỳ dọn dẹp dung lượng tự động nhằm bảo vệ hiệu năng lưu trữ của hệ thống.

---

## ⚡ 1. LUỒNG XỬ LÝ PHÁT ÂM TOÀN DIỆN (REAL-TIME AUDIO LIFE CYCLE)

Hệ thống loại bỏ hoàn toàn việc giả lập thời gian ghi âm của trình duyệt, thay thế bằng luồng tiếp nhận âm thanh thời gian thực và xếp hàng xử lý bất đồng bộ (Asynchronous Queueing):

```mermaid
sequenceDiagram
    participant Stu[Trình duyệt Học sinh]
    participant SupaStore[Supabase Audio Storage]
    participant API[API: /api/speaking/analyze]
    participant Queue[Redis / PostgreSQL Queue]
    participant AI[Whisper API & Phoneme Engine]
    participant DB[Supabase Database Tables]

    Stu->>Stu: Ghi âm giọng nói (MediaRecorder API -> WebM/WAV)
    Stu->>SupaStore: Tải lên trực tiếp tệp âm thanh vào Bucket 'speaking-audio'
    SupaStore-->>Stu: Trả về URL file ghi âm (Audio URL)
    Stu->>API: Gửi payload phân tích (Audio URL + Câu mẫu)
    API->>Queue: Đẩy công việc vào hàng đợi 'speaking_jobs'
    API-->>Stu: Trả về Job ID (Trạng thái: Đang xếp hàng)
    Queue->>AI: Xử lý Job: Lấy file ghi âm gửi tới Whisper & Phoneme Matcher
    AI-->>Queue: Trả về văn bản dịch & Điểm số đối chiếu (Phát âm, Nhịp điệu, Tự tin)
    Queue->>DB: Cập nhật kết quả vào bảng 'pronunciation_results'
    Stu->>DB: Long Polling / Webhook kiểm tra Job ID -> Hiển thị kết quả AI Coach!
```

---

## 📁 2. QUẢN LÝ LƯU TRỮ ĐÁM MÂY (SUPABASE STORAGE CONFIGURATION)

### Định cấu hình Bucket `'speaking-audio'`:
- **Định dạng cho phép**: Tệp ghi âm giọng nói chuẩn `audio/webm` hoặc `audio/wav`.
- **Dung lượng tối đa (Max File Size)**: Giới hạn tối đa **2 Megabytes (2MB)** cho mỗi tệp tin ghi âm phát âm 1 câu (tương đương khoảng 30 giây chất lượng cao), tránh tình trạng học sinh tải lên tệp tin rác.
- **Tên tệp tin mã hóa bảo mật**: `student_<student_uuid>/activity_<activity_uuid>_<timestamp>.webm` để cô lập và bảo mật quyền sở hữu file.

---

## 📐 3. BẢNG DỮ LIỆU HÀNG ĐỢI XỬ LÝ (QUEUE & JOBS TABLES SCHEMA)

Đường ống xử lý bất đồng bộ bảo vệ hệ thống khỏi tình trạng quá tải khi hàng ngàn học sinh cùng luyện phát âm đồng thời tại trường học:

```sql
-- 1. Bảng lưu trữ trạng thái hàng đợi xử lý bất đồng bộ
CREATE TABLE public.speaking_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    audio_url VARCHAR(512) NOT NULL,
    expected_transcript TEXT NOT NULL, -- Văn bản mẫu của phim cần nói theo
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_speaking_jobs_status ON public.speaking_jobs(status) WHERE status = 'queued' OR status = 'processing';

-- 2. Bảng lưu kết quả phân tích phát âm chi tiết
CREATE TABLE public.pronunciation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.speaking_jobs(id) ON DELETE CASCADE UNIQUE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recognized_transcript TEXT, -- Văn bản Whisper nhận diện thực tế
    score_pronunciation INTEGER CHECK (score_pronunciation BETWEEN 0 AND 100), -- Điểm phát âm
    score_rhythm INTEGER CHECK (score_rhythm BETWEEN 0 AND 100), -- Điểm nhịp điệu (Tempo)
    score_confidence INTEGER CHECK (score_confidence BETWEEN 0 AND 100), -- Điểm sự tự tin
    phoneme_details JSONB, -- Chi tiết âm vị sai lệch cụ thể
    coach_feedback TEXT, -- Nhận xét tự động tiếng Việt cao cấp của AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤖 4. API HANDLER ĐĂNG KÝ CÔNG VIỆC VÀ TÍCH HỢP WHISPER AI

```typescript
// /app/api/speaking/analyze/route.ts - API tiếp nhận yêu cầu phân tích phát âm thực tế
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const studentId = session.user.id;

  try {
    const { audioUrl, expectedTranscript } = await req.json();

    if (!audioUrl || !expectedTranscript) {
      return NextResponse.json({ error: "Thiếu dữ liệu đầu vào cần thiết" }, { status: 400 });
    }

    // 1. Tạo Job trong cơ sở dữ liệu hàng đợi
    const { data: job, error: jobErr } = await supabase
      .from('speaking_jobs')
      .insert({
        student_id: studentId,
        audio_url: audioUrl,
        expected_transcript: expectedTranscript,
        status: 'queued'
      })
      .select('id')
      .single();

    if (jobErr || !job) throw new Error("Không thể khởi tạo hàng đợi xử lý phát âm");

    // 2. Kích hoạt Worker bất đồng bộ chạy ngầm (Background Worker Trigger)
    // Trong môi trường Serverless (Vercel), chúng ta kích hoạt Vercel Edge Function hoặc gọi API ngầm xử lý
    triggerBackgroundAudioWorker(job.id);

    return NextResponse.json({ 
      success: true, 
      jobId: job.id, 
      message: "Đã đưa tệp ghi âm giọng nói vào hàng đợi xử lý phát âm AI" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Giả lập kích hoạt Vercel Edge worker chạy ngầm thông qua fetch không đồng bộ
function triggerBackgroundAudioWorker(jobId: string) {
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/speaking/worker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.INTERNAL_WORKER_TOKEN}` },
    body: JSON.stringify({ jobId })
  }).catch(err => console.error("Worker trigger failed:", err));
}
```

---

## 🧹 5. CHU KỲ DỌN DẸP LƯU TRỮ TỰ ĐỘNG (STORAGE CLEANUP LIFECYCLE)

> [!CAUTION]
> Tệp tin ghi âm giọng nói của 100k học sinh luyện phát âm hàng ngày có thể làm bùng nổ chi phí lưu trữ đám mây. Do đó, hệ thống áp dụng chu kỳ dọn dẹp dung lượng tự động:

- **Chính sách vòng đời (Retention Policy)**: 
  - Chỉ lưu trữ tệp tin âm thanh gốc của học sinh trong vòng **30 ngày** kể từ ngày tạo bài tập.
  - Các kết quả chấm điểm dạng số và nhận xét văn bản của AI Coach trong bảng `pronunciation_results` được lưu trữ **vĩnh viễn** để theo dõi biểu đồ tiến độ học lực lâu dài của học viên.
- **Tự động Purge**: Chạy một lịch trình ngầm hàng tuần (Cron Job) bằng Supabase pg_cron để xóa dữ liệu lưu trữ vật lý:
  ```sql
  -- Lệnh SQL tự động tìm và dọn dẹp ghi âm quá hạn
  SELECT cron.schedule(
    'purge-old-speaking-audio',
    '0 2 * * 0', -- Chạy định kỳ vào 2:00 sáng mỗi Chủ Nhật hàng tuần
    $$ 
      DELETE FROM storage.objects 
      WHERE bucket_id = 'speaking-audio' 
      AND created_at < NOW() - INTERVAL '30 days';
    $$
  );
  ```

---

## 🛠️ 6. KẾ HOẠCH TRIỂN KHAI PHASE D

1. **Khởi tạo Bucket trên Supabase Storage**: Tạo bucket `'speaking-audio'` và phân cấp chính sách truy cập RLS (Cho phép học sinh đăng tải và chỉ được tải tệp tin có tiền tố chứa UUID cá nhân).
2. **Triển khai AI Worker Handler**: Kết nối API AI Whisper chính thức từ OpenAI hoặc hệ sinh thái xử lý âm thanh bản địa tốc độ cao để bóc tách từ vựng.
3. **Phản hồi âm học thông minh (Acoustic Matcher)**: Tạo thuật toán so sánh chuỗi nguyên âm/phụ âm của từ Whisper nhận được so với chuỗi văn bản gốc để phát hiện và gạch chân đỏ những từ học sinh phát âm sai.
