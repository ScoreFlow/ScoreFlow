import { getRoles } from '$lib/server/utils/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { sessionPromise } }) => {
	return {
		session: await sessionPromise,
		roles: await getRoles((await sessionPromise)?.user),
	};
};
