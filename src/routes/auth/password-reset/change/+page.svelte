<script lang="ts">
	import { CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';

	import { changePassword } from '$lib/remote/auth.remote';
	import { Issues } from '$lib/components/issues';
	import { changePasswordSchema } from '$lib/schemas/remote/auth';

	const id = $props.id();
</script>

<CardContent class="p-6 md:p-8 max-w-md mx-auto flex flex-col gap-6">
	<div class="flex flex-col gap-2 items-center text-center">
		<h1 class="text-2xl font-bold">Wachtwoord instellen</h1>
		<div class="text-muted-foreground text-balance">
			Stel een nieuw wachtwoord in voor je account.
		</div>
	</div>

	<form
		{...changePassword.preflight(changePasswordSchema)}
		class="flex flex-col gap-6"
	>
		<div class="grid gap-3">
			<Label for="password-{id}">Nieuw wachtwoord</Label>
			<Input {...changePassword.fields.password.as('password')} id="password-{id}" placeholder="Nieuw wachtwoord"
						 required />
		</div>

		<Issues issues={changePassword.fields.allIssues()} />

		<Button class="w-full" type="submit">
			{#if changePassword.pending}
				<Spinner />
			{:else}
				Stel wachtwoord in
			{/if}
		</Button>
	</form>
</CardContent>
