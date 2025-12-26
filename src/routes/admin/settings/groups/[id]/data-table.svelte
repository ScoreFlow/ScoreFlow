<script lang="ts" module>
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis"
  import PlusIcon from "@lucide/svelte/icons/plus"
  import type { User } from "@supabase/supabase-js"
  import { type ColumnDef, getCoreRowModel, type RowData } from "@tanstack/table-core"
  import { page } from "$app/state"
  import { Badge } from "$lib/components/ui/badge"
  import { Button } from "$lib/components/ui/button"
  import { createSvelteTable, FlexRender, renderSnippet } from "$lib/components/ui/data-table"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from "$lib/components/ui/dropdown-menu"
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte"
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table"
  import { getInstrument } from "$lib/remote/admin/scores.remote"
  import { getUser } from "$lib/remote/admin/users.remote"
  import CreateGroupMemberDialog from "./create-group-member-dialog.svelte"
  import DeleteGroupMemberDialog from "./delete-group-member-dialog.svelte"
  import EditGroupMemberDialog from "./edit-group-member-dialog.svelte"

  declare module "@tanstack/table-core" {
    interface ColumnMeta<TData extends RowData, TValue> {
      class?: string
    }
  }
</script>

<script lang="ts">
  import { DropdownMenuSeparator } from '$lib/components/ui/dropdown-menu';

	interface Row {
    user_id: string
    instrument_ids: string[]
  }

  const columns: ColumnDef<Row>[] = [
    {
      id: "name",
      header: "Naam",
      cell: ({ row }) => {
        return renderSnippet(UserName, { row: row.original })
      }
    },
    {
      id: "instruments",
      header: "Instrumenten",
      cell: ({ row }) => {
        return renderSnippet(Instruments, { row: row.original })
      },
      meta: {
        class: "max-w-0 w-full"
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return renderSnippet(Actions, { row: row.original })
      }
    }
  ]

  let { data }: { data: Row[] } = $props()

  let editGroupMemberDialog = $state({
    open: false,
    user: null as User | null
  })

	let createGroupMemberDialog = $state({
		open: false,
	})

	let deleteGroupMemberDialog = $state({
		open: false,
		user: null as User | null
	})

	let table = $derived(createSvelteTable({
		data,
    columns,
    getCoreRowModel: getCoreRowModel()
	}))

  let id = $derived(page.params.id ?? "")
</script>

<div class="flex flex-col gap-2">
	<div class="flex justify-end">
		<Button variant="outline" size="sm" onclick={() => createGroupMemberDialog.open = true}>
			<PlusIcon />
			<span class="hidden lg:inline">Lid toevoegen</span>
		</Button>
	</div>
	<div class="rounded-md border [&_th]:px-4 [&_td]:px-4 [&_th:last-child]:w-0 [&_td:last-child]:w-0">
		<Table>
			<TableHeader class="bg-muted sticky top-0 z-10">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<TableRow>
						{#each headerGroup.headers as header (header.id)}
							<TableHead colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</TableHead>
						{/each}
					</TableRow>
				{/each}
			</TableHeader>
			<TableBody>
				{#each table.getRowModel().rows as row (row.id)}
					<TableRow data-state={row.getIsSelected() && "selected"} class="group">
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableCell class={cell.column.columnDef.meta?.class}>
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</TableCell>
						{/each}
					</TableRow>
				{:else}
					<TableRow>
						<TableCell colspan={columns.length} class="h-24 text-center">
							Geen resultaten.
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

<EditGroupMemberDialog bind:open={editGroupMemberDialog.open} group_id={id} user={editGroupMemberDialog.user} />
<CreateGroupMemberDialog bind:open={createGroupMemberDialog.open} group_id={id} />
<DeleteGroupMemberDialog bind:open={deleteGroupMemberDialog.open} group_id={id} user={deleteGroupMemberDialog.user} />


{#snippet UserName({ row }: {row: Row})}
	{#await getUser({id: row.user_id})}
		<Skeleton class="h-4 w-24" />
	{:then user}
		<span>{user?.user_metadata?.full_name ?? user?.email ?? ""}</span>
	{/await}
{/snippet}

{#snippet Instruments({ row }: {row: Row})}
	<div class="
	flex gap-2 overflow-x-hidden overflow-y-hidden relative min-w-0
	before:absolute before:right-0 before:top-0 before:bottom-0 before:w-8 before:bg-linear-to-l before:from-background before:to-transparent before:pointer-events-none
	after:hidden group-hover:after:block after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-linear-to-l after:from-muted/50 after:to-transparent after:pointer-events-none
	">
		{#each row.instrument_ids as id (id)}
			<Badge variant="outline">
				{(await getInstrument({ id }))?.name}
			</Badge>
		{/each}
	</div>
{/snippet}

{#snippet Actions({ row }: {row: Row})}
	<DropdownMenu>
		<DropdownMenuTrigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
					<span class="sr-only">Open menu</span>
					<EllipsisIcon />
				</Button>
			{/snippet}
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem onclick={async () => editGroupMemberDialog = {open: true, user: await getUser({id: row.user_id})}}>
				Bewerken
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem variant="destructive" onclick={async () => deleteGroupMemberDialog = {open: true, user: await getUser({id: row.user_id})}}>
				Verwijderen
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}
