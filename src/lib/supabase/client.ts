import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        getSession: async () => {
          const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('mock_admin_logged_in') === 'true';
          if (isLoggedIn) {
            return {
              data: {
                session: {
                  user: { email: 'admin@cinematicenglish.com', role: 'admin' },
                  expires_at: 9999999999,
                }
              },
              error: null
            };
          }
          return { data: { session: null }, error: null };
        },
        signInWithPassword: async ({ email, password }: any) => {
          if (email === 'admin@cinematicenglish.com' && password === 'password123') {
            if (typeof window !== 'undefined') {
              localStorage.setItem('mock_admin_logged_in', 'true');
            }
            return {
              data: {
                session: {
                  user: { email: 'admin@cinematicenglish.com', role: 'admin' },
                  expires_at: 9999999999,
                }
              },
              error: null
            };
          }
          return { 
            data: { session: null }, 
            error: { message: "Supabase Environment Variables are missing. Please add them to Vercel Project Settings." } 
          };
        },
        signOut: async () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mock_admin_logged_in');
          }
          return { error: null };
        }
      },
    } as any;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
