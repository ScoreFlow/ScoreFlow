import type { LayoutServerLoad } from './$types';
import { requireRole } from '$lib/server/utils/auth';

export const load: LayoutServerLoad = async ({ locals: { sessionPromise } }) => {
	await requireRole((await sessionPromise)?.user, 'admin');
	return {};
};
