<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check"
  import { Issues } from "$lib/components/issues"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"
  import { Button } from "$lib/components/ui/button"
  import { CardContent } from "$lib/components/ui/card"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Spinner } from "$lib/components/ui/spinner"
  import { resetPassword } from "$lib/remote/auth.remote"
  import { resetPasswordSchema } from "$lib/schemas/remote/auth"

  const id = $props.id()
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
		{...resetPassword.preflight(resetPasswordSchema)}
		class="flex flex-col gap-3"
	>
		<div class="grid gap-3">
			<Label for="email-{id}">E-mailadres</Label>
			<Input {...resetPassword.fields.email.as('email')} id="email-{id}" placeholder="E-mailadres" required />
			<Issues issues={resetPassword.fields.allIssues()} />
		</div>

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
			{#if resetPassword.pending}
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
