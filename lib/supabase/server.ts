import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const hasPlaceholderValues =
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl.includes('YOUR_PROJECT_ID') ||
    serviceRoleKey.includes('YOUR_SUPABASE_SERVICE_ROLE_KEY');

  if (hasPlaceholderValues) {
    throw new Error('Supabase environment variables are missing or still using placeholder values.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
