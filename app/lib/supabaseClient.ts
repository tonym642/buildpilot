import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (!supabaseUrl || !supabaseAnonKey) {
	if (typeof window !== "undefined") {
		console.warn("[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Supabase client not initialized.");
	}
} else {
	supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };