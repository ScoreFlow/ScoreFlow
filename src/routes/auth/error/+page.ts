import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	const error = url.searchParams.get('error');
	const errorCode = url.searchParams.get('error_code');
	const provider = url.searchParams.get('provider');

	if (!error) redirect(303, '/');
	if (error === 'access_denied' && errorCode === 'signup_disabled') redirect(303, '/auth/error/signup-disabled');

	return { error, errorCode, provider };
};