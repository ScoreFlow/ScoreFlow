<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { updateUserRoles } from '$lib/remote/admin/users.remote';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Issues } from '$lib/components/issues';
	import { updateUserRolesSchema } from '$lib/schemas/remote/admin/users';
	import type { UserData } from '$lib/types/users.types';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Constants } from '$lib/types/database.types';
	import { getRoleDisplayName } from '$lib/utils/auth';

	let { open = $bindable(false), user }: { open: boolean, user: UserData | null } = $props();

	const id = $props.id();
</script>


<Dialog bind:open>
	<DialogContent>
		<form {...updateUserRoles.preflight(updateUserRolesSchema)}>
			<input {...updateUserRoles.fields.id.as('hidden', user?.id ?? '')} />
			<DialogHeader>
				<DialogTitle>
					Rollen beheren
				</DialogTitle>
				<DialogDescription>
					Selecteer de rollen die je wilt toewijzen aan de gebruiker
					{#if user?.user_metadata.full_name}
						<span class="text-foreground">
						'{user?.user_metadata.full_name}'
						</span>
					{/if}
				</DialogDescription>
			</DialogHeader>
			<div class="flex flex-col gap-4 py-4">
				<div class="flex flex-col gap-4 py-2 pl-4">
					{#each Constants.public.Enums.Role as role}
						<div class="flex items-start gap-2">
							<Checkbox {...{ ...updateUserRoles.fields.roles.as('checkbox', role), type: undefined }}
												id="roles-{id}-{role}" checked={user?.roles.includes(role)} />
							<Label class="text-right" for="roles-{id}-{role}">{getRoleDisplayName(role)}</Label>
						</div>
					{/each}
				</div>

				<Issues class="col-span-2" issues={updateUserRoles.fields.allIssues()} />

				{#if (updateUserRoles.result?.success)}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>De rollen zijn aangepast</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">
					{#if updateUserRoles.pending}
						<Spinner />
					{:else}
						Opslaan
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>