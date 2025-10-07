import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { requireRole } from '$lib/server/utils/auth';

export const load: LayoutServerLoad = async ({ cookies, locals: { sessionPromise }, url }) => {
	const user = (await sessionPromise)?.user;

	if (user) {
		if (url.pathname === '/auth/login') redirect(303, '/');
	} else {
		if (!url.pathname.startsWith('/auth')) redirect(303, '/auth/login');
	}

	if (url.pathname.startsWith('/admin')) {
		await requireRole(user, 'admin');
	}

	return {
		sessionPromise,
		cookies: cookies.getAll()
	};
};