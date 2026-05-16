import { getGrades } from "@/app/admin/actions";
import CurriculumClient from "./CurriculumClient";

export const metadata = {
  title: "Curriculum Management | Cinematic English Admin",
  description: "Manage grades, units, and lessons for the Global Success program.",
};

export default async function CurriculumPage() {
  const grades = await getGrades();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-display font-black tracking-tight text-white">Curriculum Management</h2>
        <p className="text-white/40 font-medium italic">Quản lý chương trình học Global Success (Grade 1 - 12).</p>
      </div>

      <CurriculumClient initialGrades={grades} />
    </div>
  );
}
