import { form, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import {
	changePasswordSchema,
	loginSchema,
	oauthSchema,
	resetPasswordSchema
} from '$lib/schemas/remote/auth';

export const login = form(loginSchema, async ({ email, password }, invalid) => {
	const { locals } = getRequestEvent();

	const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

	if (error) {
		if (error.code === 'invalid_credentials') {
			invalid('E-mailadres of wachtwoord is onjuist');
			return;
		} else {
			throw error;
		}
	}

	redirect(303, '/');
});

export const oauth = form(oauthSchema, async ({ provider }, invalid) => {
	const {
		locals,
		url: { origin }
	} = getRequestEvent();

	const {
		data: { url },
		error
	} = await locals.supabase.auth.signInWithOAuth({
		provider,
		options: { redirectTo: `${origin}/auth/oauth` }
	});

	if (error) {
		console.error(error);
	}
	if (!url) {
		invalid('Er is een fout opgetreden. Probeer het later opnieuw.');
		return;
	}

	redirect(303, url);
});

export const resetPassword = form(resetPasswordSchema, async ({ email }, invalid) => {
	const {
		locals,
		url: { origin }
	} = getRequestEvent();

	const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/password-reset/change`
	});

	if (error) {
		console.error(error);
		invalid(
			'Er is iets misgegaan bij het verzenden van de herstel-link. Probeer het later opnieuw.'
		);
	}

	return { success: true };
});

export const changePassword = form(changePasswordSchema, async ({ password }, invalid) => {
	const { locals } = getRequestEvent();

	const { error: updateError } = await locals.supabase.auth.updateUser({ password });

	if (updateError) {
		if (updateError.code === 'same_password') {
			invalid(
				invalid.password('Het nieuwe wachtwoord mag niet hetzelfde zijn als het oude wachtwoord')
			);
		} else {
			invalid('Er is iets misgegaan bij het wijzigen van je wachtwoord');
		}
		return;
	}

	const { error: signOutError } = await locals.supabase.auth.signOut();
	if (signOutError) {
		throw signOutError;
	}

	redirect(303, '/auth/password-reset/success');
});
