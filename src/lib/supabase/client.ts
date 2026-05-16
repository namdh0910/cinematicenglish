import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { session: null }, error: null }),
      },
    } as any;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
