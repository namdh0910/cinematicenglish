import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Admin Dashboard | Cinematic English",
  description: "Internal management platform for Cinematic English content and users.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  
  // 1. Get Session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // 2. Fetch Profile & Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // 3. RBAC Check
  if (!profile || profile.role !== 'admin') {
    // If logged in but not admin, redirect to public home
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Sidebar with real admin profile */}
      <Sidebar adminProfile={profile} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <TopBar />

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Cinematic Aura Overlay (Subtle) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
