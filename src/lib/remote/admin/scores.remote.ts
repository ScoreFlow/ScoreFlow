import { form, query } from "$app/server"
import {
  createInstrumentSchema,
  deleteInstrumentSchema,
  updateInstrumentSchema
} from "$lib/schemas/remote/admin/scores"
import { safeGetSupabaseServerAdmin } from "$lib/server/utils/supabase"

export const getInstruments = query(async () => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { data, error } = await supabaseAdmin.from("instruments").select("*")

  if (error) throw error

  return data
})

export const createInstrument = form(createInstrumentSchema, async data => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("instruments").insert(data)

  if (error) throw error

  await getInstruments().refresh()

  return { success: true }
})

export const updateInstrument = form(updateInstrumentSchema, async ({ id, name }, invalid) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("instruments").update({ name }).eq("id", id)

  if (error) {
    invalid("Het is niet gelukt om het instrument aan te passen. Probeer het later opnieuw.")
    return
  }

  await getInstruments().refresh()

  return { success: true }
})

export const deleteInstrument = form(deleteInstrumentSchema, async ({ id }, invalid) => {
  const supabaseAdmin = await safeGetSupabaseServerAdmin()

  const { error } = await supabaseAdmin.from("instruments").delete().eq("id", id)

  if (error) {
    invalid("Het is niet gelukt om het instrument te verwijderen. Probeer het later opnieuw.")
    return
  }

  await getInstruments().refresh()

  return { success: true }
})
