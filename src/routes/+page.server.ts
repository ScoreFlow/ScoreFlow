import { getRoles } from '$lib/server/utils/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { sessionPromise } }) => {
	return {
		roles: await getRoles((await sessionPromise)?.user)
	};
};
