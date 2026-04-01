import { createClient } from '@supabase/supabase-js';

// Fallback: localStorage-based fake supabase client
function createLocalStorageClient() {
	return {
		auth: {
			// Mimic supabase.auth API
			onAuthStateChange: (cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
			getSession: async () => ({ data: { session: null } }),
			signOut: async () => {},
			signInWithOtp: async ({ email }: { email: string }) => {
				// Simulate email sign-in
				window.localStorage.setItem("bp_fake_user", email);
				return { error: null };
			},
		},
		// Add other methods as needed
	};
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any;
if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
	if (typeof window !== "undefined") {
		console.error("[Supabase] Environment variables missing: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. Using localStorage fallback.");
	}
	supabase = createLocalStorageClient();
}

export { supabase };