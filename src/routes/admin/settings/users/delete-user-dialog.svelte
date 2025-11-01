<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import type { UserData } from '$lib/types/users.types';
	import { deleteUser } from '$lib/remote/admin/users.remote';
	import { deleteUserSchema } from '$lib/schemas/remote/admin/users';
	import { DialogClose } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Issues } from '$lib/components/issues';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Spinner } from '$lib/components/ui/spinner';

	let { open = $bindable(false), user }: { open: boolean, user: UserData | null } = $props();
</script>

<Dialog bind:open>
	<DialogContent>
		<form {...deleteUser.preflight(deleteUserSchema)}>
			<input {...deleteUser.fields.id.as('hidden', user?.id ?? '')} />
			<DialogHeader>
				<DialogTitle>
					Gebruiker verwijderen
				</DialogTitle>
				<DialogDescription>
					Weet je zeker dat je de gebruiker
					{#if user?.user_metadata.full_name}
						<span class="text-foreground">
						'{user?.user_metadata.full_name}'
						</span>
					{/if}
					wilt verwijderen?
				</DialogDescription>
			</DialogHeader>
			<div class="flex flex-col gap-4 py-2">
				<Issues class="col-span-2" issues={deleteUser.fields.allIssues()} />

				{#if (deleteUser.result?.success)}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>De gebruiker is verwijderd</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<div class="flex flex-row justify-between w-full gap-4 mt-4">
					<Button type="submit" variant="destructive">
						{#if deleteUser.pending}
							<Spinner />
						{:else}
							Verwijderen
						{/if}
					</Button>
					<DialogClose>
						{#snippet child({ props })}
							<Button type="button" variant="outline" {...props}>Annuleren</Button>
						{/snippet}
					</DialogClose>
				</div>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>