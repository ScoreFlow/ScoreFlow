import { form, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { isValidProvider } from '$lib/utils/auth';

export const login = form(async data => {
	const { locals } = getRequestEvent()

	const email = data.get('email') as string;

	if (!/^[\w-.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)) {
		return { error: 'Ongeldig e-mailadres' };
	}
	const password = data.get('password') as string;

	const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

	if (error) {
		return { error: `Ongeldige gebruikersnaam en/of wachtwoord` };
	}

	redirect(303, '/');
})

export const oauth = form(async data => {
	const { locals, url: { origin } } = getRequestEvent()

	const provider = data.get('provider') as string | null;

	if (provider && isValidProvider(provider)) {
		const {
			data: { url },
			error
		} = await locals.supabase.auth.signInWithOAuth({
			provider,
			options: { redirectTo: `${origin}/auth/oauth` }
		})

		if (error) {
			return { error: error.message };
		}
		if (!url) {
			return { error: 'Er is een fout opgetreden. Probeer het later opnieuw.' };
		}

		redirect(303, url);
	} else {
		return { error: 'Ongeldige OAuth provider' };
	}
});

export const resetPassword = form(async data => {
	const { locals, url: { origin } } = getRequestEvent();

	const email = data.get('email') as string;
	if (!/^[\w-.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)) {
		return { error: 'Ongeldig e-mailadres' };
	}

	const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/password-reset/change`
	});

	if (error) {
		return { error: 'Er is iets misgegaan bij het verzenden van de herstel-link. Probeer het later opnieuw.' };
	}

	return { success: true };
});

export const changePassword = form(async data => {
	const { locals } = getRequestEvent();

	const password = data.get('password') as string;
	if (password.length < 6) {
		return { error: 'Wachtwoord moet minimaal 6 tekens lang zijn' };
	}

	const { error: updateError } = await locals.supabase.auth.updateUser({ password });

	if (updateError) {
		if (updateError.code === 'same_password') {
			return { error: 'Het nieuwe wachtwoord mag niet hetzelfde zijn als het oude wachtwoord' };
		}

		return { error: 'Er is iets misgegaan bij het instellen van je wachtwoord. Probeer het later opnieuw.' };
	}

	const { error: signOutError } = await locals.supabase.auth.signOut();
	if (signOutError) {
		throw signOutError;
	}

	redirect(303, '/auth/password-reset/success');
});