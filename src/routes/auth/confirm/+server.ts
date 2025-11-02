import type { EmailOtpType } from '@supabase/supabase-js'
import { type RequestHandler, redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	if (url.searchParams.get('error')) {
		const searchParams = new URLSearchParams(url.searchParams)
		redirect(303, `/auth/error?${searchParams.toString()}`)
	}

	const token_hash = url.searchParams.get('token_hash')
	const type = url.searchParams.get('type') as EmailOtpType | null
	const next = url.searchParams.get('next') ?? '/'

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ type, token_hash })
		if (!error) {
			redirect(303, next)
		}
	}

	redirect(303, '/auth/error?error=invalid-token')
}
