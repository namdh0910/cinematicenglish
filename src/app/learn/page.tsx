import { Suspense } from "react";
import { getGrades } from "@/app/admin/actions";
import LearnClient from "./LearnClient";

export const metadata = {
  title: "Learning Hub | Global Success",
  description: "Master the Global Success curriculum through interactive learning.",
};

export default async function LearnPage() {
  const grades = await getGrades();

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#3D3D3B] w-full flex flex-col">
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1899D6]"></div>
        </div>
      }>
        <LearnClient initialGrades={grades} />
      </Suspense>
    </div>
  );
}
