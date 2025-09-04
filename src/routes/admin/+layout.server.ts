import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/utils/auth';

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent }) => {
	const { user } = await parent();
	await requireAdmin(supabase, user);
	return {};
};
