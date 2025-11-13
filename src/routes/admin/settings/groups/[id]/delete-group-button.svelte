<script lang="ts">
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check"
  import { goto } from "$app/navigation"
  import { Issues } from "$lib/components/issues"
  import { Button } from "$lib/components/ui/button"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "$lib/components/ui/dialog"
  import { Spinner } from "$lib/components/ui/spinner"
  import { deleteGroup } from "$lib/remote/admin/groups.remote"
  import type { Tables } from "$lib/types/database.types"

  let { group }: { group: Tables<"groups"> } = $props()
</script>

<Dialog>
	<DialogTrigger>
		{#snippet child({ props })}
			<Button variant="destructive" size="sm" {...props}>Groep verwijderen</Button>
		{/snippet}
	</DialogTrigger>
	<DialogContent>

		<form {...deleteGroup.enhance(
			async ({ submit }) => {
				await submit()
				if (deleteGroup.result?.success) {
					await goto(`/admin/settings/groups`)
				}
			})}>
			<input {...deleteGroup.fields.id.as('hidden', group.id)} />
			<DialogHeader>
				<DialogTitle>
					Groep verwijderen
				</DialogTitle>
				<DialogDescription>
					Weet je zeker dat je de groep
					<span class="text-foreground">
			'{group.name}'
			</span>
					wilt verwijderen?
				</DialogDescription>
			</DialogHeader>
			<div class="flex flex-col gap-4 py-2">
				<Issues class="col-span-2" issues={deleteGroup.fields.allIssues()} />
			</div>
			<DialogFooter>
				<div class="flex flex-row justify-between w-full gap-4 mt-4">
					<Button type="submit" variant="destructive">
						{#if deleteGroup.pending}
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