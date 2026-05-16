"use client";
import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  Users as UsersIcon,
  Download,
  Calendar,
  Zap
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import UserTable from "@/components/admin/UserTable";
import UserDetailModal, { UserDetail } from "@/components/admin/UserDetailModal";

interface UsersClientProps {
  initialUsers: any[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || "");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All Plans' && value !== 'All Status') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters('query', searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-white flex items-center gap-4">
            User Ecosystem
          </h2>
          <p className="text-white/40 font-medium italic">"Monitoring the growth and engagement of the Cinematic community."</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 space-y-8 shadow-2xl">
        <div className="flex flex-col xl:flex-row gap-6 justify-between">
          <div className="flex flex-1 flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email or ID..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
              />
            </div>

            <div className="flex gap-3">
              <select 
                value={searchParams.get('plan') || "All Plans"}
                onChange={(e) => updateFilters('plan', e.target.value)}
                className="bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white/60 hover:text-white appearance-none focus:outline-none transition-all cursor-pointer"
              >
                <option value="All Plans">All Plans</option>
                <option value="Free">Free Plan</option>
                <option value="Pro">Pro Plan</option>
                <option value="Group">Group Plan</option>
              </select>

              <select 
                value={searchParams.get('status') || "All Status"}
                onChange={(e) => updateFilters('status', e.target.value)}
                className="bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white/60 hover:text-white appearance-none focus:outline-none transition-all cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive</option>
                <option value="Banned">Banned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <UserTable users={initialUsers} onViewUser={(user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
      }} />

      <UserDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
