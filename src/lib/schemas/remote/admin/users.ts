import * as z from "zod"
import { Constants } from "$lib/types/database.types"

export const inviteUserSchema = z.object({
  name: z.string().min(1, "Vul een naam in"),
  email: z.email("Ongeldig e-mailadres")
})

export const getUserSchema = z.object({
  id: z.uuid()
})

export const deleteUserSchema = z.object({
  id: z.uuid()
})

export const getUserRolesSchema = z.object({
  id: z.uuid()
})

export const updateUserRolesSchema = z.object({
  id: z.uuid(),
  roles: z
    .array(z.enum(Constants.public.Enums.Role))
    .optional()
    .refine(items => new Set(items).size === (items?.length ?? 0), {
      message: "Er mogen geen dubbele rollen worden toegewezen"
    })
})
