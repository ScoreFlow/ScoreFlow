import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, locals: { safeGetSession }, url }) => {
	const { session, user } = await safeGetSession();

	if (user) {
		if (url.pathname === '/auth/login') redirect(303, '/');
	} else {
		if (!url.pathname.startsWith('/auth')) redirect(303, '/auth/login');
	}

	return {
		session,
		user,
		cookies: cookies.getAll()
	};
};