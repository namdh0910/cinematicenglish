import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a robust proxy that handles any chained calls
    const createProxy = (): any => {
      const fn = () => {};
      return new Proxy(fn, {
        get: (target: any, prop: any) => {
          if (prop === 'then') {
            return (resolve: any) => resolve({ data: [], error: null, count: 0 });
          }
          return createProxy();
        },
        apply: (target: any, thisArg: any, args: any) => {
          return createProxy();
        }
      });
    };

    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => createProxy(),
    } as any;
  }

  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignore error if set from Server Component
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignore error if removed from Server Component
          }
        },
      },
    }
  )
}
