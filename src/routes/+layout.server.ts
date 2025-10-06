import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getRoles } from '$lib/server/utils/auth';

export const load: LayoutServerLoad = async ({ cookies, locals: { safeGetSession }, url }) => {
	const { session, user } = await safeGetSession();

	if (user) {
		if (url.pathname === '/auth/login') redirect(303, '/');
	} else {
		if (!url.pathname.startsWith('/auth')) redirect(303, '/auth/login');
	}

	const roles = await getRoles(user);

	return {
		session,
		user,
		roles,
		cookies: cookies.getAll()
	};
};