"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session) {
        // Refresh router to ensure middleware picks up the new session
        router.refresh();
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Make sure your account has admin access.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12 relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-glow-amber mx-auto mb-8">
            <Zap size={32} className="text-black" fill="black" />
          </div>
          <h1 className="text-4xl font-display font-black tracking-tighter text-white">Director Login</h1>
          <p className="text-white/40 font-medium italic">"Access the Cinematic Control Center."</p>
        </div>

        {/* Login Form */}
        <div className="p-8 rounded-[40px] bg-[#1a1a1a] border border-white/5 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cinematicenglish.com"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 ml-4">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-white text-black font-display font-black text-lg shadow-glow-white hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Enter Studio <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
              Gợi ý: admin@cinematicenglish.com / password123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/10 uppercase tracking-[0.4em] font-black">
          Cinematic English © 2024 Production Systems
        </p>
      </motion.div>
    </div>
  );
}
