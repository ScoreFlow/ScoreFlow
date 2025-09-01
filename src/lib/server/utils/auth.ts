import type { User, SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export async function isAdmin(supabase: SupabaseClient, user: User | null): Promise<boolean> {
	if (!user) {
		return false;
	}

	const { count, error } = await supabase
		.from('admins')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user.id);

	if (error) {
		throw error;
	}

	return count !== null && count > 0;
}

export async function requireAdmin(supabase: SupabaseClient, user: User | null) {
	if (!await isAdmin(supabase, user)) {
		throw redirect(303, '/');
	}
}
