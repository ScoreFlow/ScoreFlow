import * as z from 'zod';

export const createInstrumentSchema = z.object({
	name: z.string().min(1, 'Vul een naam in')
});
