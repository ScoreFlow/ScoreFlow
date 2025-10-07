<script lang="ts">
	import type { Provider } from '@supabase/supabase-js';
	import { getProviderDisplayName } from '$lib/utils/auth';

	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/spinner';

	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	import { login, oauth } from '$lib/remote/auth.remote';

	const id = $props.id();

	let loadingOauth: Partial<{ [key in Provider]: boolean }> = $state({});
</script>

{#snippet oauthForm(provider: Provider)}
	{@const form = oauth.for(provider)}
	<form {...form} onsubmit={() => loadingOauth[provider] = true}>
		<input type="hidden" name="provider" value={provider}>
		<Button type="submit" variant="outline" class="w-full">
			{#if (loadingOauth[provider] ?? false)}
				<Spinner />
			{:else}
				<span>
					<img src={`/images/oauth-providers/${provider}.svg`} alt="" class="mr-2 h-4 w-4" />
				</span>
				Inloggen met {getProviderDisplayName(provider)}
			{/if}
		</Button>
	</form>
	{#if form.result}
		<Alert variant="destructive">
			<AlertCircleIcon />
			<AlertDescription>{form.result.error}</AlertDescription>
		</Alert>
	{/if}
{/snippet}

<CardContent class="grid p-0 md:grid-cols-2 wide-content">
	<div class="p-6 md:p-8">
		<div class="flex flex-col gap-6">

			<div class="flex flex-col items-center text-center">
				<h1 class="text-2xl font-bold">ScoreFlow</h1>
				<div class="text-muted-foreground text-balance">Log in om door te gaan</div>
			</div>

			<div class="flex flex-col gap-4">
				{@render oauthForm('github')}
				{@render oauthForm('google')}
			</div>

			<div
				class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
			>
								<span class="bg-card text-muted-foreground relative z-10 px-2">
									of
								</span>
			</div>

			<form
				{...login}
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

				<div class="grid gap-3">
					<div class="flex items-center">
						<Label for="password-{id}">Wachtwoord</Label>
						<Button class="ml-auto px-0" href="/auth/password-reset" variant="link">Wachtwoord vergeten?</Button>
					</div>
					<Input id="password-{id}" name="password" placeholder="Wachtwoord" required type="password" />
				</div>

				{#if login.result}
					<Alert variant="destructive">
						<AlertCircleIcon />
						<AlertDescription>{login.result.error}</AlertDescription>
					</Alert>
				{/if}

				<Button class="w-full" type="submit">
					{#if (login.pending)}
						<Spinner />
					{:else}
						Inloggen
					{/if}
				</Button>

			</form>
		</div>
	</div>
	<div class="bg-muted items-center justify-center hidden md:flex">
		<img
			alt=""
			class="inset-0 object-cover w-full m-24"
			src="/favicon.svg"
		/>
	</div>
</CardContent>
