import type { User, SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export async function requireAdmin(supabase: SupabaseClient, user: User | null) {
	if (!user) {
		redirect(303, '/');
	}

	const { count, error } = await supabase
		.from('admins')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user.id);

	if (error) {
		throw error;
	}

	if (count === null || count === 0) {
		redirect(303, '/');
	}
}
