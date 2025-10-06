import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { sessionPromise } = await parent();

	if (!(await sessionPromise)) {
		throw redirect(303, '/auth/password-reset');
	}

	return {};
};