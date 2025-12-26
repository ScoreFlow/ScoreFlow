<script lang="ts">
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check"
  import type { User } from "@supabase/supabase-js"
  import { Issues } from "$lib/components/issues"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"
  import { Button } from "$lib/components/ui/button"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from "$lib/components/ui/dialog"
  import { Spinner } from "$lib/components/ui/spinner"
  import { getGroup, updateGroupMemberInstruments } from "$lib/remote/admin/groups.remote"
  import { updateGroupMemberInstrumentsSchema } from "$lib/schemas/remote/admin/groups"

  let { open = $bindable(false), user, group_id }: { open: boolean; user: User | null; group_id: string } = $props()

  let group = $derived(await getGroup({ id: group_id }))
</script>

<Dialog bind:open>
	<DialogContent>
		<form {...updateGroupMemberInstruments.preflight(updateGroupMemberInstrumentsSchema)}>
			<input {...updateGroupMemberInstruments.fields.user_id.as('hidden', user?.id ?? '')} />
			<input {...updateGroupMemberInstruments.fields.group_id.as('hidden', group_id)} />
			<DialogHeader>
				<DialogTitle>
					Groepslid verwijderen
				</DialogTitle>
				<DialogDescription>
					Weet je zeker dat je de gebruiker
					{#if user?.user_metadata.full_name}
						<span class="text-foreground">
						'{user?.user_metadata.full_name}'
						</span>
					{/if}
					uit de groep
					<span class="text-foreground">
						'{group?.name}'
					</span>
					wilt verwijderen?
				</DialogDescription>
			</DialogHeader>
			<div class="flex flex-col gap-4 py-2">
				<Issues class="col-span-2" issues={updateGroupMemberInstruments.fields.allIssues()} />

				{#if (updateGroupMemberInstruments.result?.success)}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>Het groepslid is verwijderd</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<div class="flex flex-row justify-between w-full gap-4 mt-4">
					<Button type="submit" variant="destructive">
						{#if updateGroupMemberInstruments.pending}
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