<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { inviteUser } from '$lib/remote/admin/users.remote';
	import { Input } from '$lib/components/ui/input';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Issues } from '$lib/components/issues';
	import { inviteUserSchema } from '$lib/schemas/remote/admin/users';

	const id = $props.id();
</script>

<Dialog>
	<DialogTrigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
		<PlusIcon />
		<span class="hidden lg:inline">Gebruiker toevoegen</span>
	</DialogTrigger>
	<DialogContent>
		<form {...inviteUser.preflight(inviteUserSchema)}>
			<DialogHeader>
				<DialogTitle>Gebruiker toevoegen</DialogTitle>
				<DialogDescription>
					Vul naam en e-mailadres in om een gebruiker toe te voegen.
				</DialogDescription>
			</DialogHeader>
			<div class="grid grid-cols-[auto_1fr] gap-4 py-4">
				<Label class="text-right" for="name-{id}">Naam</Label>
				<Input {...inviteUser.fields.name.as('text')} class="grow" id="name-{id}" required />

				<Label class="text-right" for="email-{id}">E-mailadres</Label>
				<Input {...inviteUser.fields.email.as('email')} class="grow" id="email-{id}" required />

				<Issues class="col-span-2" issues={inviteUser.fields.allIssues()} />

				{#if inviteUser.result?.success}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>Er is een e-mail met een uitnodiging verstuurd</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">
					{#if inviteUser.pending}
						<Spinner />
					{:else}
						Toevoegen
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
