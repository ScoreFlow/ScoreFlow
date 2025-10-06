import type { User } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { Enums } from '$lib/types/database.types';
import { getRequestEvent } from '$app/server';

export async function getRoles(user: User | null): Promise<Enums<'Role'>[]> {
	const {
		locals: { supabase }
	} = getRequestEvent();
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

	return roles.map((role) => role.role);
}

export async function requireRole(user: User | null, role: Enums<'Role'>) {
	if (!(await getRoles(user)).includes(role)) {
		error(403, 'Je hebt geen toegang tot deze pagina.');
	}
}
