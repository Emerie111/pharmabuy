import { createServerClient as createServerClientBase, type CookieOptions } from '@supabase/ssr'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

// Log environment variables at the module scope to see if they are loaded when the module is imported
console.log("lib/supabase-server.ts: NEXT_PUBLIC_SUPABASE_URL=", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("lib/supabase-server.ts: NEXT_PUBLIC_SUPABASE_ANON_KEY=", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Exists' : 'MISSING');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Critical Error: Missing env.NEXT_PUBLIC_SUPABASE_URL');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Critical Error: Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL // No longer directly used here
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // No longer directly used here

// Create a server-side Supabase client with cookies for auth
export function createServerClient(cookieStore: ReadonlyRequestCookies) {
  return createServerClientBase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can fail if we're in a middleware or similar where cookies can't be set
            console.warn('Warning: Could not set cookie', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.warn('Warning: Could not remove cookie', error)
          }
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )
} 