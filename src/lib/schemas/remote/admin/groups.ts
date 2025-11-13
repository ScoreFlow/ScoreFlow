import * as z from "zod"

export const createGroupSchema = z.object({
  name: z.string().min(1, "Vul een naam in")
})

export const getGroupSchema = z.object({
  id: z.uuid()
})

export const deleteGroupSchema = z.object({
  id: z.uuid()
})

export const getGroupMembersSchema = z.object({
  id: z.uuid()
})

export const updateGroupSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Vul een naam in")
})

export const updateGroupMemberInstrumentsSchema = z.object({
  group_id: z.uuid(),
  user_id: z.uuid(),
  instruments: z.array(z.uuid()).optional()
})

export const getGroupMemberInstrumentsSchema = z.object({
  group_id: z.uuid(),
  user_id: z.uuid()
})
