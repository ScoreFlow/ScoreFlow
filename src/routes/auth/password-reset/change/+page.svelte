<script lang="ts">
	import { CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Spinner } from '$lib/components/spinner';

	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	import { changePassword } from '$lib/remote/auth.remote';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const id = $props.id();
	let loading: boolean = $state(false);

	// Redirect to the login page if no session exists
	$effect(() => {
		if (!data.session) {
			goto('/auth/login');
		}
	});
</script>

<CardContent class="p-6 md:p-8 max-w-md mx-auto flex flex-col gap-6">
	<div class="flex flex-col gap-2 items-center text-center">
		<h1 class="text-2xl font-bold">Wachtwoord instellen</h1>
		<div class="text-muted-foreground text-balance">
			Stel een nieuw wachtwoord in voor je account.
		</div>
	</div>

	<form
		{...changePassword.enhance(async ({ submit }) => {
			loading = true;
			await submit();
			loading = false;
		})}
		class="flex flex-col gap-6"
	>
		<div class="grid gap-3">
			<Label for="password-{id}">Nieuw wachtwoord</Label>
			<Input
				id="password-{id}"
				name="password"
				placeholder="Nieuw wachtwoord"
				required
				type="password"
			/>
		</div>

		{#if changePassword.result?.error}
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertDescription>{changePassword.result.error}</AlertDescription>
			</Alert>
		{/if}

		<Button class="w-full" type="submit">
			{#if loading}
				<Spinner />
			{:else}
				Stel wachtwoord in
			{/if}
		</Button>
	</form>
</CardContent>
