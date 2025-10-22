import { form, getRequestEvent, query } from '$app/server';
import { requireRole } from '$lib/server/utils/auth';
import { Constants } from '$lib/types/database.types';
import { getSupabaseServerAdmin } from '$lib/server/utils/supabase';
import { createInstrumentSchema } from '$lib/schemas/remote/admin/scores';

export const getInstruments = query(async () => {
	const {
		locals: { getSession }
	} = getRequestEvent();

	const session = await getSession();

	await requireRole(session?.user, Constants.public.Enums.Role[0]);

	const supabaseAdmin = getSupabaseServerAdmin();

	const { data, error } = await supabaseAdmin.from('instruments').select('*');

	if (error) throw error;

	return data;
});

export const createInstrument = form(createInstrumentSchema, async (data) => {
	const {
		locals: { getSession }
	} = getRequestEvent();

	const session = await getSession();

	await requireRole(session?.user, Constants.public.Enums.Role[0]);

	const supabaseAdmin = getSupabaseServerAdmin();

	const { error } = await supabaseAdmin.from('instruments').insert(data);

	if (error) throw error;

	await getInstruments().refresh();

	return { success: true };
});
