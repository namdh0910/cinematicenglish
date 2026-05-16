import StoryForm from "@/components/admin/StoryForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getStoryById } from "@/app/admin/actions";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Story | Cinematic English Admin",
  description: "Update an existing cinematic learning experience.",
};

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

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
          <h2 className="text-3xl font-display font-black tracking-tight text-white">Edit Story</h2>
          <p className="text-white/40 font-medium italic">Cập nhật nội dung câu chuyện: <span className="text-amber-500">{story.title}</span></p>
        </div>
      </div>

      {/* Main Composer Form */}
      <StoryForm initialData={story} />
    </div>
  );
}
