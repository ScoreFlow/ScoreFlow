<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Spinner } from '$lib/components/spinner';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		})

		return () => data.subscription.unsubscribe();
	})
</script>

<ModeWatcher/>

<svelte:boundary>
	<main class="overflow-y-auto h-full">
		{@render children()}
	</main>

	{#snippet pending()}
		<div class="h-screen flex items-center justify-center">
			<Spinner size="lg"/>
		</div>
	{/snippet}
</svelte:boundary>