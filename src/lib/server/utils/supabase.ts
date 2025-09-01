import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '$lib/types/database.types';

export const getSupabaseServerAdmin = () => {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		cookies: {
			getAll: () => []
		}
	});
};