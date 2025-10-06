<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ComponentProps } from 'svelte';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import PanelLeftCloseIcon from '@lucide/svelte/icons/panel-left-close';
	import PanelLeftOpenIcon from '@lucide/svelte/icons/panel-left-open';

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<Button
	{...restProps}
	class={className}
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	type="button"
	variant="ghost"
>
	{#if sidebar.isMobile ? sidebar.openMobile : sidebar.open}
		<PanelLeftCloseIcon />
		<span>Sluit menu</span>
	{:else}
		<PanelLeftOpenIcon />
		<span>Open menu</span>
	{/if}
</Button>
