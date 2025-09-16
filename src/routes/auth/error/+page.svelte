<script lang="ts">
	import { CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<CardContent class="p-6 md:p-8 flex flex-col gap-6 items-center text-center">
	<h1 class="text-2xl font-bold">Er is een fout opgetreden</h1>
	<Button href="/auth/login" variant="outline">Opnieuw inloggen</Button>
	<div class="text-muted-foreground text-sm">
		<p>Foutmelding: {data.error}</p>
		{#if data.errorCode}
			<p>Oorzaak: {data.errorCode}</p>
		{/if}
		{#if data.provider}
			<p>Provider: {data.provider}</p>
		{/if}
	</div>
</CardContent>