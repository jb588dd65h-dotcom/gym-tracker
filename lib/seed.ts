// ── Seed script (development / template reference only) ───────────────────
//
// This script requires a SUPABASE_SERVICE_ROLE_KEY in .env.local to bypass RLS,
// since the new per-user policies block unauthenticated inserts.
//
// In production, new users receive the template exercises automatically when they
// sign up (see lib/auth-context.tsx → copyTemplateIfNew).
//
// To use: add SUPABASE_SERVICE_ROLE_KEY to .env.local, then run:
//   npm run db:seed

import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { TEMPLATE_EXERCISES } from './template-exercises'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

if (!serviceRoleKey) {
  console.error(
    'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local\n' +
    'The seed script requires the service role key to bypass RLS.\n' +
    'New users get template exercises automatically via the sign-up flow.'
  )
  process.exit(1)
}

// Service role client bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function seed() {
  console.log('Deleting existing exercises (no user_id filter — service role)...')
  const { error: deleteError } = await supabase.from('exercises').delete().is('user_id', null)
  if (deleteError) {
    console.error('Error deleting exercises:', deleteError)
    process.exit(1)
  }

  console.log(`Inserting ${TEMPLATE_EXERCISES.length} template exercises (user_id = null)...`)
  const { data, error: insertError } = await supabase
    .from('exercises')
    .insert(TEMPLATE_EXERCISES) // no user_id → template rows
    .select()

  if (insertError) {
    console.error('Error inserting exercises:', insertError)
    process.exit(1)
  }

  console.log(`Successfully inserted ${data?.length ?? 0} exercises!`)
}

seed()
