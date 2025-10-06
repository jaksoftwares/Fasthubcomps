// /lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServerClient = createClient(supabaseUrl, supabaseServiceKey);

// Optional: helper function
export function getSupabaseServerClient() {
  return supabaseServerClient;
}
