import type { LayoutServerLoad } from './$types';
import { requireRole } from '$lib/server/utils/auth';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { user } = await parent();
	await requireRole(user, 'admin');
	return {};
};
