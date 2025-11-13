import type { Provider } from "@supabase/supabase-js"
import * as z from "zod"
import { isValidProvider } from "$lib/utils/auth"

export const loginSchema = z.object({
  email: z.email("Ongeldig e-mailadres"),
  password: z.string().min(6, "Wachtwoord moet minimaal 6 tekens lang zijn")
})

export const oauthSchema = z.object({
  provider: z
    .string()
    .refine(val => isValidProvider(val), "Ongeldige OAuth provider")
    .transform(val => val as Provider)
})

export const resetPasswordSchema = z.object({
  email: z.email("Ongeldig e-mailadres")
})

export const changePasswordSchema = z.object({
  password: z.string().min(6, "Wachtwoord moet minimaal 6 tekens lang zijn")
})
