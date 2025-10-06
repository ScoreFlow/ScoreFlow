import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			sessionPromise: Promise<Session | null>;
		}

		interface PageData {
			sessionPromise?: Promise<Session | null>;
			supabase?: SupabaseClient<Database>;
			cookies?: { name: string; value: string }[];
		}
	}
}
