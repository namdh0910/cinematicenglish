import StoryForm from "@/components/admin/StoryForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create New Story | Cinematic English Admin",
  description: "Compose a new cinematic learning experience.",
};

export default function NewStoryPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/stories" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} /> Back to Library
        </Link>
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white">Create New Story</h2>
          <p className="text-white/40 font-medium italic">Bắt đầu xây dựng một trải nghiệm học tập điện ảnh mới.</p>
        </div>
      </div>

      {/* Main Composer Form */}
      <StoryForm />
    </div>
  );
}
