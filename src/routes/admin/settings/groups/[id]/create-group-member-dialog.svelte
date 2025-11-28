<script lang="ts">
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check"
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core"
  import { Issues } from "$lib/components/issues"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"
  import { Button } from "$lib/components/ui/button"
  import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
  } from "$lib/components/ui/command"
  import { createSvelteTable, FlexRender, renderComponent } from "$lib/components/ui/data-table"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from "$lib/components/ui/dialog"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Spinner } from "$lib/components/ui/spinner"
  import { Table, TableBody, TableCell, TableRow } from "$lib/components/ui/table"
  import { getGroup, updateGroupMemberInstruments } from "$lib/remote/admin/groups.remote"
  import { getInstruments } from "$lib/remote/admin/scores.remote"
  import { getUser, getUsers } from "$lib/remote/admin/users.remote"
  import { updateGroupMemberInstrumentsSchema } from "$lib/schemas/remote/admin/groups"
  import type { Tables } from "$lib/types/database.types"
  import DataTableCheckbox from "./data-table-checkbox.svelte"

  let {
    open = $bindable(false),
    group_id
  }: {
    open: boolean
    group_id: string
  } = $props()

  const id = $props.id()

  let group = $derived(await getGroup({ id: group_id }))
  let instruments = $derived(await getInstruments())

  const instrumentTableColumns: ColumnDef<Tables<"instruments">>[] = [
    {
      id: "select",
      cell: ({ row }) => {
        return renderComponent(DataTableCheckbox, {
          "aria-label": "Selecteer instrument",
          ...{
            ...updateGroupMemberInstruments.fields.instruments.as("checkbox", row.original.id),
            type: undefined
          }
        })
      }
    },
    {
      id: "name",
      accessorKey: "name"
    }
  ]

  const instrumentTable = createSvelteTable({
    get data() {
      return instruments
    },
    columns: instrumentTableColumns,
    getCoreRowModel: getCoreRowModel()
  })

  let userId: string = $state("")
  let userSelectionOpen = $state(false)
  let user = $derived(userId ? await getUser(userId) : undefined)
</script>

<CommandDialog bind:open={userSelectionOpen} bind:value={userId}>
	<CommandInput placeholder="Zoek een gebruiker" />
	<CommandList>
		<CommandGroup>
			{#await getUsers()}
				<CommandEmpty class="flex justify-center items-center">
					<Spinner />
				</CommandEmpty>
			{:then users}
				<CommandEmpty>Geen gebruikers gevonden</CommandEmpty>
				{#each users as user}
					<CommandItem onclick={() => {userSelectionOpen = false}} class="cursor-pointer"
											 value={user.id} keywords={[user.user_metadata?.full_name ?? '', user.email]}>
						{#if user.user_metadata?.full_name}
							<span>{user.user_metadata?.full_name}</span>
							<span class="text-muted-foreground">{user.email}</span>
						{:else}
							<span>{user.email}</span>
						{/if}
					</CommandItem>
				{/each}
			{/await}
		</CommandGroup>
	</CommandList>
</CommandDialog>

<Dialog bind:open>
	<DialogContent class="flex flex-col gap-4">
		<form {...updateGroupMemberInstruments.preflight(updateGroupMemberInstrumentsSchema)} class="contents">
			<input {...updateGroupMemberInstruments.fields.group_id.as('hidden', group?.id ?? '')} />
			<input {...updateGroupMemberInstruments.fields.user_id.as('hidden', userId || 'undefined')} bind:value={userId} />
			<input class="hidden" {...updateGroupMemberInstruments.fields.new.as('checkbox')} checked={true} />
			<DialogHeader>
				<DialogTitle>
					Nieuw groepslid
				</DialogTitle>
				<DialogDescription>
					Voeg een lid toe aan de groep
					<span class="text-foreground">
						'{group?.name}'
					</span>
				</DialogDescription>
			</DialogHeader>

			<div class="grid gap-3">
				<Label for="{id}-user">Gebruiker</Label>
				<Input id="{id}-user" type="button" class="cursor-pointer text-left {user ? '' : 'text-muted-foreground'}"
							 onclick={() => {userSelectionOpen = true}}
							 value={user?.user_metadata.full_name ?? user?.email ?? 'Selecteer een gebruiker'} />
			</div>

			<div class="grid gap-3">
				<Label>Instrumenten</Label>
				<div class="rounded-md border">
					<Table>
						<TableBody>
							{#each instrumentTable.getRowModel().rows as row (row.id)}
								<TableRow class="has-[button[aria-checked=true]]:bg-muted">
									{#each row.getVisibleCells() as cell (cell.id)}
										<TableCell>
											<FlexRender
												content={cell.column.columnDef.cell}
												context={cell.getContext()}
											/>
										</TableCell>
									{/each}
								</TableRow>
							{:else}
								<TableRow>
									<TableCell colspan={instrumentTableColumns.length} class="h-24 text-center">
										Er zijn nog geen instrumenten toegevoegd.
									</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</div>
			<Issues issues={updateGroupMemberInstruments.fields.allIssues()} />
			{#if (updateGroupMemberInstruments.result?.success)}
				<Alert>
					<CircleCheckIcon />
					<AlertDescription>De gebruiker is aan de groep toegevoegd</AlertDescription>
				</Alert>
			{/if}
			<DialogFooter>
				<Button type="submit">
					{#if updateGroupMemberInstruments.pending}
						<Spinner />
					{:else}
						Opslaan
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>