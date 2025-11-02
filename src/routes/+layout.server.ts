import { error, redirect } from '@sveltejs/kit'
import { getRoles, requireRole } from '$lib/server/utils/auth'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies, locals: { getSession }, url }) => {
	const session = await getSession()

	if (session?.user) {
		if (url.pathname === '/auth/login') redirect(303, '/')
		if (url.pathname == '/auth/password-reset') redirect(303, '/auth/password-reset/change')
	} else {
		if (!url.pathname.startsWith('/auth')) redirect(303, '/auth/login')
		if (url.pathname == '/auth/password-reset/change')
			error(403, { message: 'Je hebt geen toegang tot deze pagina' })
	}

	if (url.pathname.startsWith('/admin')) {
		await requireRole(session?.user, 'admin')
	}

	const rolesPromise = getRoles(session?.user)

	return {
		session,
		rolesPromise,
		cookies: cookies.getAll()
	}
}
