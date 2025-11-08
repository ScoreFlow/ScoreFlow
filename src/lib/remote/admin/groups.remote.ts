import { form, query } from '$app/server';
import { safeGetSupabaseServerAdmin } from '$lib/server/utils/supabase';
import {
	createGroupSchema,
	deleteGroupSchema,
	getGroupMembersSchema,
	getGroupMemberInstrumentsSchema,
	updateGroupMemberInstrumentsSchema
} from '$lib/schemas/remote/admin/groups';
import { updateHelper } from '$lib/utils/db';

export const getGroups = query(async () => {
	const supabaseAdmin = await safeGetSupabaseServerAdmin();

	const { data, error } = await supabaseAdmin.from('groups').select('*');

	if (error) throw error;

	return data;
});

export const createGroup = form(createGroupSchema, async ({ name }) => {
	const supabaseAdmin = await safeGetSupabaseServerAdmin();

	const { error } = await supabaseAdmin.from('groups').insert({ name });

	if (error) throw error;

	await getGroups().refresh();

	return { success: true };
});

export const deleteGroup = form(deleteGroupSchema, async ({ id }, invalid) => {
	const supabaseAdmin = await safeGetSupabaseServerAdmin();

	const { error } = await supabaseAdmin.from('groups').delete().eq('id', id);

	if (error) {
		invalid('Het is niet gelukt om de groep te verwijderen. Probeer het later opnieuw.');
		return;
	}

	await getGroups().refresh();

	return { success: true };
});

export const getGroupMembers = query(getGroupMembersSchema, async ({ id }) => {
	const supabaseAdmin = await safeGetSupabaseServerAdmin();

	const { data, error } = await supabaseAdmin
		.from('user_group_instruments')
		.select('user_id')
		.eq('group_id', id);

	if (error) throw error;

	return Array.from(new Set(data.map((row) => row.user_id)));
});

export const getGroupMemberInstruments = query(
	getGroupMemberInstrumentsSchema,
	async ({ group_id, user_id }) => {
		const supabaseAdmin = await safeGetSupabaseServerAdmin();

		const { data, error } = await supabaseAdmin
			.from('user_group_instruments')
			.select('instrument_id')
			.eq('group_id', group_id)
			.eq('user_id', user_id);

		if (error) throw error;

		return data.map((row) => row.instrument_id);
	}
);

export const updateGroupMemberInstruments = form(
	updateGroupMemberInstrumentsSchema,
	async ({ group_id, user_id, instruments }, invalid) => {
		const supabaseAdmin = await safeGetSupabaseServerAdmin();

		const updates = await updateHelper(
			await getGroupMemberInstruments({ group_id, user_id }),
			instruments ?? [],
			async (instrument_id) =>
				await supabaseAdmin
					.from('user_group_instruments')
					.delete()
					.eq('group_id', group_id)
					.eq('user_id', user_id)
					.eq('instrument_id', instrument_id),
			async (instrument_id) =>
				await supabaseAdmin.from('user_group_instruments').insert({
					group_id,
					user_id,
					instrument_id
				})
		);

		const errors = updates.filter((update) => update.error).map((update) => update.error);

		if (errors.length > 0) {
			invalid('Het is niet gelukt om de instrumenten aan te passen. Probeer het later opnieuw.');
			return;
		}

		await getGroupMemberInstruments({ group_id, user_id }).refresh();

		return { success: true };
	}
);
