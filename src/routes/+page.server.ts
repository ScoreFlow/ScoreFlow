import { getRoles } from '$lib/server/utils/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();

	return {
		roles: await getRoles(session?.user)
	};
};
