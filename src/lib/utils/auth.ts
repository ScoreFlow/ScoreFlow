import type { Provider } from '@supabase/supabase-js';
import type { Enums } from '$lib/types/database.types';

const providers: Provider[] = [
	'apple',
	'azure',
	'bitbucket',
	'discord',
	'facebook',
	'github',
	'gitlab',
	'google',
	'keycloak',
	'linkedin',
	'notion',
	'slack',
	'spotify',
	'twitch',
	'twitter',
	'workos',
	'zoom'
];

export function isValidProvider(input: string): input is Provider {
	return providers.includes(input as Provider)
}

const providerDisplayNames: Partial<Record<Provider, string>> = {
	apple: 'Apple',
	azure: 'Microsoft',
	bitbucket: 'Bitbucket',
	discord: 'Discord',
	facebook: 'Facebook',
	github: 'GitHub',
	gitlab: 'GitLab',
	google: 'Google',
	keycloak: 'Keycloak',
	linkedin: 'LinkedIn',
	notion: 'Notion',
	slack: 'Slack',
	spotify: 'Spotify',
	twitch: 'Twitch',
	twitter: 'Twitter',
	workos: 'WorkOS',
	zoom: 'Zoom'
} as const;

export function getProviderDisplayName(provider: Provider): string | null {
	return providerDisplayNames[provider] ?? null;
}

const roleDisplayNames: Record<Enums<"Role">, string> = {
	admin: 'Beheerder'
} as const;

export function getRoleDisplayName(role: Enums<"Role">): string {
	return roleDisplayNames[role];
}