import { form, query } from "$app/server"
import {
  createGroupSchema,
  deleteGroupSchema,
  getGroupMemberInstrumentsSchema,
  getGroupMembersSchema,
  getGroupSchema,
  updateGroupMemberInstrumentsSchema,
  updateGroupSchema
} from "$lib/schemas/remote/admin/groups"
import { safeGetSupabaseServerAdmin } from "$lib/server/utils/supabase"
import { updateHelper } from "$lib/utils/db"

export const getGroups = query(async () => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin.from("groups").select("*")

  if (error) throw error

  return data
})

export const getGroup = query(getGroupSchema, async ({ id }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin.from("groups").select("*").eq("id", id).single()

  if (error) throw error

  return data
})

export const createGroup = form(createGroupSchema, async ({ name }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("groups").insert({ name })

  if (error) throw error

  await getGroups().refresh()

  return { success: true }
})

export const deleteGroup = form(deleteGroupSchema, async ({ id }, invalid) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("groups").delete().eq("id", id)

  if (error) {
    invalid("Het is niet gelukt om de groep te verwijderen. Probeer het later opnieuw.")
    return
  }

  await getGroups().refresh()

  return { success: true }
})

export const getGroupMembers = query(getGroupMembersSchema, async ({ id }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin.from("user_group_instruments").select("*").eq("group_id", id)

  if (error) throw error

  const groupedData = data.reduce(
    (acc, { user_id, instrument_id }) => {
      if (!acc[user_id]) {
        acc[user_id] = { user_id, instrument_ids: [] }
      }
      acc[user_id].instrument_ids.push(instrument_id)
      return acc
    },
    {} as Record<string, { user_id: string; instrument_ids: string[] }>
  )

  return Object.values(groupedData)
})

export const getGroupMemberInstruments = query(getGroupMemberInstrumentsSchema, async ({ group_id, user_id }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin
    .from("user_group_instruments")
    .select("instrument_id")
    .eq("group_id", group_id)
    .eq("user_id", user_id)

  if (error) throw error

  return data.map(row => row.instrument_id)
})

export const updateGroup = form(updateGroupSchema, async ({ id, name }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("groups").update({ name }).eq("id", id)

  if (error) throw error

  getGroup({ id }).set({ id, name })
  await getGroups().refresh()

  return { success: true }
})

export const updateGroupMemberInstruments = form(
  updateGroupMemberInstrumentsSchema,
  async ({ group_id, user_id, instruments }, invalid) => {
    const supabaseAdmin = await safeGetSupabaseServerAdmin()

    const updates = await updateHelper(
      await getGroupMemberInstruments({ group_id, user_id }),
      instruments ?? [],
      async instrument_id =>
        await supabaseAdmin
          .from("user_group_instruments")
          .delete()
          .eq("group_id", group_id)
          .eq("user_id", user_id)
          .eq("instrument_id", instrument_id),
      async instrument_id =>
        await supabaseAdmin.from("user_group_instruments").insert({
          group_id,
          user_id,
          instrument_id
        })
    )

    const errors = updates.filter(update => update.error).map(update => update.error)

    if (errors.length > 0) {
      invalid("Het is niet gelukt om de instrumenten aan te passen. Probeer het later opnieuw.")
      return
    }

    getGroupMemberInstruments({ group_id, user_id }).set(instruments ?? [])
    await getGroupMembers({ id: group_id }).refresh()

    return { success: true }
  }
)
