import { getGradeWithDetails } from "@/app/admin/actions";
import GradeDetailsClient from "./GradeDetailsClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GradeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const grade = await getGradeWithDetails(id);

  if (!grade) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/curriculum" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Curriculum
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-black tracking-tight text-white">{grade.title}</h2>
            <p className="text-white/40 font-medium italic">{grade.description}</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="badge badge-gold px-4 py-2">Active Curriculum</span>
          </div>
        </div>
      </div>

      <GradeDetailsClient grade={grade} />
    </div>
  );
}
