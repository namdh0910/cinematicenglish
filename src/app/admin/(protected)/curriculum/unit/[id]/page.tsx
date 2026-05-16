import { getUnitWithDetails } from "@/app/admin/actions";
import UnitEditorClient from "./UnitEditorClient";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UnitEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unit = await getUnitWithDetails(id);

  if (!unit) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href={`/admin/curriculum`} 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Grade
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-black uppercase tracking-widest">Unit {unit.order_index}</span>
               <h2 className="text-3xl font-display font-black tracking-tight text-white">{unit.title}</h2>
            </div>
            <p className="text-white/40 font-medium italic">{unit.description}</p>
          </div>
        </div>
      </div>

      <UnitEditorClient unit={unit} />
    </div>
  );
}
