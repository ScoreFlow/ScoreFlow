import * as z from "zod"

export const createConcertSchema = z.object({
  name: z.string().min(1, "Vul een naam in"),
  active: z.boolean().optional().default(true)
})

export const getConcertSchema = z.object({
  id: z.uuid()
})

export const deleteConcertSchema = z.object({
  id: z.uuid()
})

export const updateConcertSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Vul een naam in").optional(),
  active: z.boolean().optional()
})

export const getConcertGroupsSchema = z.object({
  id: z.uuid()
})

export const updateConcertGroupsSchema = z.object({
  id: z.uuid(),
  groups: z.array(z.uuid()).optional()
})
