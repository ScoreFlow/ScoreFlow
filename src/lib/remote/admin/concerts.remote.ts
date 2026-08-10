import { form, query } from "$app/server"
import {
  createConcertSchema,
  deleteConcertSchema,
  getConcertGroupsSchema,
  getConcertSchema,
  updateConcertGroupsSchema,
  updateConcertSchema
} from "$lib/schemas/remote/admin/concerts"
import { safeGetSupabaseServerAdmin } from "$lib/server/utils/supabase"
import { updateHelper } from "$lib/utils/db"

export const getConcerts = query(async () => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin.from("concerts").select("*")

  if (error) throw error

  return data
})

export const createConcert = form(createConcertSchema, async ({ name, active }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("concerts").insert({ name, active })

  if (error) throw error

  return { success: true }
})

export const deleteConcert = form(deleteConcertSchema, async ({ id }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("concerts").delete().eq("id", id)

  if (error) throw error

  await getConcerts().refresh()

  return { success: true }
})

export const updateConcert = form(updateConcertSchema, async ({ id, name, active }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("concerts").update({ name, active }).eq("id", id)

  if (error) throw error

  await getConcert({ id }).refresh()
  await getConcerts().refresh()

  return { success: true }
})

export const getConcert = query.batch(getConcertSchema, async input => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin
    .from("concerts")
    .select("*")
    .in(
      "id",
      input.map(({ id }) => id)
    )

  if (error) throw error

  return ({ id }) => data.find(concert => concert.id === id)
})

export const getConcertGroups = query(getConcertGroupsSchema, async ({ id }) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin.from("concert_groups").select("group_id").eq("concert_id", id)

  if (error) throw error

  return data.map(({ group_id }) => group_id)
})

export const updateConcertGroups = form(updateConcertGroupsSchema, async ({ id, groups }, invalid) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const concertGroups = await getConcertGroups({ id })

  const updates = await updateHelper(
    concertGroups,
    groups ?? [],
    async group_id => await supabaseAdmin.from("concert_groups").delete().eq("concert_id", id).eq("group_id", group_id),
    async group_id =>
      await supabaseAdmin.from("concert_groups").insert({
        concert_id: id,
        group_id
      })
  )

  const errors = updates.filter(update => update.error).map(update => update.error)

  if (errors.length > 0) {
    invalid("Het is niet gelukt om de groepen aan te passen. Probeer het later opnieuw.")
    return
  }

  getConcertGroups({ id }).set(groups ?? [])

  return { success: true }
})
