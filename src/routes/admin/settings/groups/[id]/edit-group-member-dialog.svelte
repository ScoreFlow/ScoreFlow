<script lang="ts">
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check"
  import type { User } from "@supabase/supabase-js"
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core"
  import { untrack } from "svelte"
  import { Issues } from "$lib/components/issues"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"
  import { Button } from "$lib/components/ui/button"
  import { createSvelteTable, FlexRender, renderComponent } from "$lib/components/ui/data-table"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from "$lib/components/ui/dialog"
  import { Spinner } from "$lib/components/ui/spinner"
  import { Table, TableBody, TableCell, TableRow } from "$lib/components/ui/table"
  import { getGroup, getGroupMemberInstruments, updateGroupMemberInstruments } from "$lib/remote/admin/groups.remote"
  import { getInstruments } from "$lib/remote/admin/scores.remote"
  import { updateGroupMemberInstrumentsSchema } from "$lib/schemas/remote/admin/groups"
  import type { Tables } from "$lib/types/database.types"
  import DataTableCheckbox from "./data-table-checkbox.svelte"

  let {
    open = $bindable(false),
    group_id,
    user
  }: {
    open: boolean
    group_id: string
    user: User | null
  } = $props()

  let group = $derived(await getGroup({ id: group_id }))
  let instruments = $derived(await getInstruments())
  let memberInstruments = $derived(
    user?.id ? await getGroupMemberInstruments({ group_id: group_id, user_id: user.id }) : []
  )

  $effect(() => {
    const memberInstrumentsCopy = memberInstruments
    untrack(() => {
      updateGroupMemberInstruments.fields.instruments.set(memberInstrumentsCopy)
    })
  })

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
</script>

<Dialog bind:open>
	<DialogContent class="flex flex-col gap-4">
		<form {...updateGroupMemberInstruments.preflight(updateGroupMemberInstrumentsSchema)} class="contents">
			<input {...updateGroupMemberInstruments.fields.user_id.as('hidden', user?.id ?? '')} />
			<input {...updateGroupMemberInstruments.fields.group_id.as('hidden', group?.id ?? '')} />
			<DialogHeader>
				<DialogTitle>
					Groepslid bewerken
				</DialogTitle>
				<DialogDescription>
					Bewerk het groepslid
					<span class="text-foreground">
						'{user?.user_metadata?.full_name ?? user?.email}'
						</span>
					van de groep
					<span class="text-foreground">
						'{group?.name}'
						</span>
				</DialogDescription>
			</DialogHeader>
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
			<Issues issues={updateGroupMemberInstruments.fields.allIssues()} />
			{#if (updateGroupMemberInstruments.result?.success)}
				<Alert>
					<CircleCheckIcon />
					<AlertDescription>De instrumenten zijn aangepast</AlertDescription>
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