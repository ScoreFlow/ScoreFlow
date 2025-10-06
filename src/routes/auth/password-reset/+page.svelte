<script lang="ts">
	import { CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Spinner } from '$lib/components/spinner';

	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import CheckIcon from '@lucide/svelte/icons/check';

	import { resetPassword } from '$lib/remote/auth.remote';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const id = $props.id();
	let loading: boolean = $state(false);

	// Redirect to change password page if a session exists
	$effect(() => {
		if (data.session) {
			goto('/auth/password-reset/change');
		}
	});
</script>

<CardContent class="p-6 md:p-8 max-w-md mx-auto flex flex-col gap-6">
	<div class="flex flex-col gap-2 items-center text-center">
		<h1 class="text-2xl font-bold">Wachtwoord vergeten?</h1>
		<div class="text-muted-foreground text-balance">
			Vul je e-mailadres in. Als dit bij ons bekend is, sturen we je een e-mail met instructies om je wachtwoord te
			herstellen.
		</div>
	</div>

	<form
		{...resetPassword.enhance(async ({ submit }) => {
			loading = true;
			await submit();
			loading = false;
		})}
		class="flex flex-col gap-6"
	>
		<div class="grid gap-3">
			<Label for="email-{id}">E-mailadres</Label>
			<Input
				id="email-{id}"
				name="email"
				placeholder="E-mailadres"
				required
				type="email"
			/>
		</div>

		{#if resetPassword.result?.error}
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertDescription>{resetPassword.result.error}</AlertDescription>
			</Alert>
		{/if}


		{#if resetPassword.result?.success}
			<Alert>
				<CheckIcon />
				<AlertDescription>
					Als het e-mailadres bij ons bekend is, hebben we een e-mail gestuurd met instructies om je wachtwoord te
					herstellen.
				</AlertDescription>
			</Alert>
		{/if}


		<Button class="w-full" type="submit">
			{#if loading}
				<Spinner />
			{:else}
				Stuur herstel-link
			{/if}
		</Button>
	</form>

	<div class="text-center text-sm">
		<Button href="/auth/login" variant="link">Terug naar inloggen</Button>
	</div>
</CardContent>
