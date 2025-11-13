import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  // Redirect to the password reset form for now
  // TODO: Setup user onboarding
  redirect(303, `/auth/password-reset/change`)
}
