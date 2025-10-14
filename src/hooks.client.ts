import * as z from 'zod';
import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
	z.config(z.locales.nl());
};
