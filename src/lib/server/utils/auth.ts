import type { User, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { Database, Enums } from '$lib/types/database.types';

export async function getRoles(supabase: SupabaseClient<Database>, user: User | null): Promise<Enums<"Role">[]> {
	if (!user) {
		return [];
	}

	const { data: roles, error } = await supabase
		.from('user_roles')
		.select('role')
		.eq('user_id', user.id);

	if (error) {
		throw error;
	}

	return roles.map(role => role.role);
}

export async function requireRole(supabase: SupabaseClient<Database>, user: User | null, role: Enums<"Role">) {
	if (!(await getRoles(supabase, user)).includes(role)) {
		error(403, 'Je hebt geen toegang tot deze pagina.');
	}
}
