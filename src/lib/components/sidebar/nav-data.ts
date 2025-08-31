import { DrumIcon, LayoutDashboardIcon, MusicIcon, SettingsIcon } from '@lucide/svelte';
import type { Component } from 'svelte';

export interface MenuItem {
	title: string;
	url: string;
	isActive?: boolean;
	icon?: Component;
	items?: { title: string; url: string }[];
}

export const navData: {
	navAdmin: MenuItem[];
} = {
	navAdmin: [
		{
			title: 'Dashboard',
			url: '/admin',
			icon: LayoutDashboardIcon
		},
		{
			title: 'Muziekstukken',
			url: '/admin/parts',
			icon: MusicIcon,
			items: [
				{
					title: 'Uploaden',
					url: '/admin/parts/upload'
				}
			]
		},
		{
			title: 'Concerten',
			url: '/admin/concerts',
			icon: DrumIcon
		},
		{
			title: 'Instellingen',
			url: '/admin/settings',
			icon: SettingsIcon,
			items: [
				{
					title: 'Orkesten',
					url: '/admin/settings/orchestras'
				},
				{
					title: 'Instrumenten',
					url: '/admin/settings/instruments'
				},
				{
					title: 'Gebruikers',
					url: '/admin/settings/users'
				}
			]
		}
	]
};
