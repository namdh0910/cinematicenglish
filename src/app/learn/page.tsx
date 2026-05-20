import { Suspense } from "react";
import { getGrades } from "@/app/admin/actions";
import LearnClient from "./LearnClient";

export const metadata = {
  title: "Bảng điều khiển học tập | Cinematic English",
  description: "Học tiếng Anh chuẩn Cinematic Edtech qua phim và sách giáo khoa.",
};

export default async function LearnPage() {
  const grades = await getGrades();

  return (
    <div className="w-full h-full bg-[#070B14]">
      <Suspense fallback={
        <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
        </div>
      }>
        <LearnClient initialGrades={grades} />
      </Suspense>
    </div>
  );
}
