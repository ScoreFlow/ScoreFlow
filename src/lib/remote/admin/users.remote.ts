import { form, getRequestEvent, query } from "$app/server"
import {
  deleteUserSchema,
  getUserRolesSchema,
  inviteUserSchema,
  updateUserRolesSchema
} from "$lib/schemas/remote/admin/users"
import { requireRole } from "$lib/server/utils/auth"
import { getSupabaseServerAdmin } from "$lib/server/utils/supabase"
import { Constants } from "$lib/types/database.types"
import type { UserData } from "$lib/types/users.types"

export const getUsers = query(async (): Promise<UserData[]> => {
  const {
    locals: { getSession }
  } = getRequestEvent()

  const session = await getSession()

  await requireRole(session?.user, Constants.public.Enums.Role[0])

  const supabaseAdmin = getSupabaseServerAdmin()
  const {
    data: { users: rawUsers },
    error
  } = await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    throw error
  }

  return await Promise.all(
    rawUsers.map(async user => {
      const { roles } = await getUserRoles({ id: user.id })
      return {
        ...user,
        roles
      } as UserData
    })
  )
})

export const inviteUser = form(inviteUserSchema, async ({ name, email }, invalid) => {
  const {
    locals: { getSession },
    url: { origin }
  } = getRequestEvent()

  const session = await getSession()

  await requireRole(session?.user, Constants.public.Enums.Role[0])

  const supabaseAdmin = getSupabaseServerAdmin()

  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name },
    redirectTo: `${origin}/auth/onboarding`
  })

  if (error) {
    if (error.code === "email_exists") {
      invalid(invalid.email("Dit e-mailadres is al in gebruik. Vraag de gebruiker om hun wachtwoord te herstellen."))
    } else {
      invalid("Het is niet gelukt om de gebruiker uit te nodigen. Probeer het later opnieuw.")
    }
    return
  }

  return { success: true }
})

export const deleteUser = form(deleteUserSchema, async ({ id }, invalid) => {
  const {
    locals: { getSession }
  } = getRequestEvent()

  const session = await getSession()

  await requireRole(session?.user, Constants.public.Enums.Role[0])

  const supabaseAdmin = getSupabaseServerAdmin()

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

  if (error) {
    invalid("Het is niet gelukt om de gebruiker te verwijderen. Probeer het later opnieuw.")
  }

  return { success: true }
})

export const getUserRoles = query(getUserRolesSchema, async ({ id }) => {
  const {
    locals: { getSession }
  } = getRequestEvent()

  const session = await getSession()

  await requireRole(session?.user, Constants.public.Enums.Role[0])

  const supabaseAdmin = getSupabaseServerAdmin()

  const { data: roles, error } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", id)

  if (error) {
    throw error
  }

  return { roles: roles.map(v => v.role) }
})

export const updateUserRoles = form(updateUserRolesSchema, async ({ id, roles }, invalid) => {
  const {
    locals: { getSession }
  } = getRequestEvent()

  const session = await getSession()

  await requireRole(session?.user, Constants.public.Enums.Role[0])

  const supabaseAdmin = getSupabaseServerAdmin()

  const currentRolesSet = new Set((await getUserRoles({ id })).roles)
  const newRolesSet = new Set(roles)

  const rolesToDelete = currentRolesSet.difference(newRolesSet)
  const rolesToAdd = newRolesSet.difference(currentRolesSet)

  const updates = await Promise.all([
    ...Array.from(rolesToAdd).map(role =>
      supabaseAdmin.from("user_roles").insert({
        user_id: id,
        role
      })
    ),
    ...Array.from(rolesToDelete).map(role =>
      supabaseAdmin.from("user_roles").delete().eq("user_id", id).eq("role", role)
    )
  ])

  const errors = updates.filter(update => update.error).map(update => update.error)

  if (errors.length > 0) {
    invalid("Het is niet gelukt om de rollen aan te passen. Probeer het later opnieuw.")
    return
  }

  return { success: true }
})
