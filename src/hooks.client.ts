import type { ClientInit } from '@sveltejs/kit'
import * as z from 'zod'

export const init: ClientInit = async () => {
	z.config(z.locales.nl())
}
