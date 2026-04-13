import { createBrowserClient } from '@supabase/ssr'

// createBrowserClient (from @supabase/ssr) stores the auth session in cookies
// so the Next.js middleware can read it server-side — unlike the plain
// createClient which uses localStorage only.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
)
