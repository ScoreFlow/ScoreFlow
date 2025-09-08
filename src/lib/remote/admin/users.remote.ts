import { isAdmin } from '$lib/server/utils/auth';
import { form, getRequestEvent, query } from '$app/server';
import { getSupabaseServerAdmin } from '$lib/server/utils/supabase';
import type { User } from '@supabase/supabase-js';

export interface UserData extends User {
	admin: boolean;
}

export const getUsers = query(async (): Promise<UserData[]> => {
	const { locals } = getRequestEvent();
	const { user } = await locals.safeGetSession();

	if (!(await isAdmin(locals.supabase, user))) {
		throw new Error('Unauthorized');
	}

	const supabaseAdmin = getSupabaseServerAdmin();
	const {
		data: { users: rawUsers },
		error
	} = await supabaseAdmin.auth.admin.listUsers();

	if (error) {
		throw error;
	}

	await new Promise(resolve => setTimeout(resolve, 1000));

	return await Promise.all(
		rawUsers.map(async (user) => {
			const admin = await isAdmin(supabaseAdmin, user);
			return {
				...user,
				admin
			} as UserData;
		})
	);
});

export const inviteUser = form(async (data) => {
	const name = data.get('name') as string | null;
	const email = data.get('email') as string | null;

	if (!email || !name) {
		return { error: 'Vul alle velden in.' };
	}

	const {
		locals,
		url: { origin }
	} = getRequestEvent();
	const { user } = await locals.safeGetSession();

	if (!(await isAdmin(locals.supabase, user))) {
		throw new Error('Unauthorized');
	}

	const supabaseAdmin = getSupabaseServerAdmin();

	const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
		data: { full_name: name },
		redirectTo: `${origin}/auth/onboarding`
	});

	if (error) {
		if (error.code === 'email_exists') {
			return {
				error:
					'Dit e-mailadres is al in gebruik. Vraag de gebruiker om hun wachtwoord te herstellen.'
			};
		}
		return { error: 'Het is niet gelukt om de gebruiker aan te maken. Probeer het later opnieuw.' };
	}

	return { success: true };
});
