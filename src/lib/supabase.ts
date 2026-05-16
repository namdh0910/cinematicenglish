import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Dùng trong Server Components & Server Actions
export function createServerClient() {
  return createServerComponentClient({ cookies })
}

// Dùng trong Client Components
export function createBrowserClient() {
  return createClientComponentClient()
}
