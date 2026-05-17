"use client";
import { useEffect } from "react";
import { initObservability, setObservabilityUser } from "@/lib/observability/observability";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ObservabilityInitializer() {
  useEffect(() => {
    // 1. Start capturing crashes, rage clicks, hydration mismatches, etc.
    initObservability();

    const supabase = createSupabaseBrowserClient();

    // 2. Resolve initial active session user for logging context
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setObservabilityUser(session.user.id);
      }
    });

    // 3. Dynamically track active auth state changes to link user profiles
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setObservabilityUser(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
