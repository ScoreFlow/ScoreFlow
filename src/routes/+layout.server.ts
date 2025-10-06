import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, locals: { sessionPromise }, url }) => {
	if ((await sessionPromise)?.user) {
		if (url.pathname === '/auth/login') redirect(303, '/');
	} else {
		if (!url.pathname.startsWith('/auth')) redirect(303, '/auth/login');
	}

	return {
		sessionPromise,
		cookies: cookies.getAll()
	};
};