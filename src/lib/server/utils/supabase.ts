import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { Constants, type Database } from '$lib/types/database.types';
import { requireRole } from '$lib/server/utils/auth';
import { getRequestEvent } from '$app/server';

export const getSupabaseServerAdmin = () => {
	return createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});
};

export const safeGetSupabaseServerAdmin = async () => {
	await requireRole(
		(await getRequestEvent().locals.getSession())?.user,
		Constants.public.Enums.Role[0]
	);
	return getSupabaseServerAdmin();
};