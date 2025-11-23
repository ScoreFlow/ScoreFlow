<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check"
  import { page } from "$app/state"
  import { Issues } from "$lib/components/issues"
  import { Button } from "$lib/components/ui/button"
  import { Card, CardContent, CardTitle } from "$lib/components/ui/card"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { Spinner } from "$lib/components/ui/spinner"
  import { getGroup, getGroupMembers, updateGroup } from "$lib/remote/admin/groups.remote"
  import { updateGroupSchema } from "$lib/schemas/remote/admin/groups"
  import DataTable from "./data-table.svelte"
  import DeleteGroupButton from "./delete-group-button.svelte"

  let id = $derived(page.params.id ?? "")
  let group = $derived(await getGroup({ id }))
  let form = $derived(updateGroup.for(id))

  let name: string = $state("")

  $effect(() => {
    name = group.name
  })

  let data = $derived(await getGroupMembers({ id }))
</script>

<h1 class="text-2xl font-bold mb-4">Groep beheren</h1>

<svelte:boundary>
	<div class="flex flex-col gap-8 max-w-lg">
		<form {...form.preflight(updateGroupSchema)} class="flex flex-col gap-2" method="post">
			<input {...form.fields.id.as('hidden', group.id ?? '')} />

			<h2 class="text-xl font-bold">Instellingen</h2>

			<div class="grid gap-3 max-w-xs">
				<Label for="name-{id}">Naam</Label>
				<Input
					{...form.fields.name.as('text')}
					bind:value={name}
					class="grow"
					id="name-{id}"
					required
				/>
				<Issues class="col-span-2" issues={form.fields.allIssues()} />
			</div>


			<div class="flex gap-4 items-center">
				<Button disabled={name === group.name || !name.trim()} type="submit">
					{#if form.pending}
						<Spinner />
					{:else}
						Opslaan
					{/if}
				</Button>
				{#if (form.result?.success)}
					<div class="flex text-sm items-center gap-1">
						<CheckIcon size={16} />
						<span>Opgeslagen</span>
					</div>
				{/if}
			</div>
		</form>

		<div>
			<h2 class="text-xl font-bold mb-2">Leden</h2>
			<DataTable {data}/>
		</div>

		<Card class="text-destructive border-destructive">
			<CardContent class="flex flex-col items-start gap-4">
				<CardTitle class="text-xl">Gevarenzone</CardTitle>
				<DeleteGroupButton {group} />
			</CardContent>
		</Card>
	</div>

	{#snippet pending()}
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<Skeleton class="h-24 w-full" />
			<Skeleton class="h-24 w-full" />
			<Skeleton class="h-24 w-full" />
			<Skeleton class="h-24 w-full" />
			<Skeleton class="h-24 w-full" />
		</div>
	{/snippet}
</svelte:boundary>