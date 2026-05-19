import { getLessonWithDetails } from "@/app/admin/actions";
import LessonPlayerClient from "./LessonPlayerClient";
import DictationRoom from "./DictationRoom";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Immersive Player | Cinematic English",
  description: "Learn English through a cinematic, interactive activity player.",
};

export default async function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonWithDetails(id);

  if (!lesson) {
    notFound();
  }

  if (lesson.type === "dictation") {
    return <DictationRoom lesson={lesson} />;
  }

  return (
    <div className="bg-primary min-h-screen text-white">
      <LessonPlayerClient lesson={lesson} />
    </div>
  );
}
