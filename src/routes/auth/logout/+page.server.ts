import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	await locals.supabase.auth.signOut();

	redirect(303, '/login');
};
