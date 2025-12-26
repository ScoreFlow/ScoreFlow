import * as z from "zod"

export const getInstrumentSchema = z.object({
  id: z.uuid()
})

export const createInstrumentSchema = z.object({
  name: z.string().min(1, "Vul een naam in")
})

export const updateInstrumentSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Vul een naam in")
})

export const deleteInstrumentSchema = z.object({
  id: z.uuid()
})
