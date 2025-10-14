import { getRoles, requireRole } from '$lib/server/utils/auth';
import { form, getRequestEvent, query } from '$app/server';
import { getSupabaseServerAdmin } from '$lib/server/utils/supabase';
import type { User } from '@supabase/supabase-js';
import { Constants, type Enums } from '$lib/types/database.types';
import { inviteUserSchema } from '$lib/schemas/remote/admin/users';

export interface UserData extends User {
	roles: Enums<'Role'>[];
}

export const getUsers = query(async (): Promise<UserData[]> => {
	const {
		locals: { getSession }
	} = getRequestEvent();

	const session = await getSession();

	await requireRole(session?.user, Constants.public.Enums.Role[0]);

	const supabaseAdmin = getSupabaseServerAdmin();
	const {
		data: { users: rawUsers },
		error
	} = await supabaseAdmin.auth.admin.listUsers();

	if (error) {
		throw error;
	}

	return await Promise.all(
		rawUsers.map(async (user) => {
			const roles = await getRoles(user);
			return {
				...user,
				roles
			} as UserData;
		})
	);
});

export const inviteUser = form(inviteUserSchema, async ({ name, email }, invalid) => {
	const {
		locals: { getSession },
		url: { origin }
	} = getRequestEvent();

	const session = await getSession();

	await requireRole(session?.user, Constants.public.Enums.Role[0]);

	const supabaseAdmin = getSupabaseServerAdmin();

	const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
		data: { full_name: name },
		redirectTo: `${origin}/auth/onboarding`
	});

	if (error) {
		if (error.code === 'email_exists') {
			invalid(
				invalid.email(
					'Dit e-mailadres is al in gebruik. Vraag de gebruiker om hun wachtwoord te herstellen.'
				)
			);
		} else {
			invalid('Het is niet gelukt om de gebruiker uit te nodigen. Probeer het later opnieuw.');
		}
		return;
	}

	return { success: true };
});
