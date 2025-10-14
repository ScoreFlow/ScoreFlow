import * as z from 'zod';

export const inviteUserSchema = z.object({
	name: z.string().min(1, 'Vul een naam in'),
	email: z.email('Ongeldig e-mailadres')
});
