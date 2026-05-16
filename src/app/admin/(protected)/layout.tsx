import Sidebar from "@/components/admin/Sidebar";
import TopBar from "@/components/admin/TopBar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard | Cinematic English",
  description: "Internal management platform for Cinematic English content and users.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-session");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Sidebar - tự chiếm không gian */}
      <Sidebar />

      {/* Main Content Area - phần còn lại */}
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
