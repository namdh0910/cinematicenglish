import { getGradeWithDetails } from "@/app/admin/actions";
import GradeClient from "./GradeClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Grade Curriculum Path | Cinematic English",
  description: "Select a Unit and Lesson to start your interactive learning journey.",
};

export default async function GradeCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const grade = await getGradeWithDetails(id);

  if (!grade) {
    notFound();
  }

  return (
    <div className="bg-primary min-h-screen text-white">
      <GradeClient grade={grade} />
    </div>
  );
}
