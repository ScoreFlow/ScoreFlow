import { createServerClient } from '@supabase/ssr';
import type { Handle, ServerInit } from '@sveltejs/kit';
import * as z from 'zod';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database.types';
import type { Session } from '@supabase/supabase-js';

export const init: ServerInit = async () => {
	z.config(z.locales.nl());
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	/**
	 * Retrieves the session information and validated user data.
	 *
	 * @function
	 * @name event.locals.getSession
	 * @returns {Promise<Session|null>} A promise that resolves to the session object if it exists, or null if no session data is available.
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return null;
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error || !user) {
			return null;
		}

		return { ...session, user: user } as Session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
