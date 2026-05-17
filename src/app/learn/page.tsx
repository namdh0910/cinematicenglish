import { getGrades } from "@/app/admin/actions";
import LearnClient from "./LearnClient";

export const metadata = {
  title: "Learning Hub | Cinematic English",
  description: "Master the Global Success curriculum through cinematic, interactive learning.",
};

export default async function LearnPage() {
  const grades = await getGrades();

  return (
    <div className="bg-primary min-h-screen text-white">
      <LearnClient initialGrades={grades} />
    </div>
  );
}
