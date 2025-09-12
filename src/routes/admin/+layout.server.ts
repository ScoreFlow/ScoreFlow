import type { LayoutServerLoad } from './$types';
import { requireRole } from '$lib/server/utils/auth';

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent }) => {
	const { user } = await parent();
	await requireRole(supabase, user, 'admin');
	return {};
};
