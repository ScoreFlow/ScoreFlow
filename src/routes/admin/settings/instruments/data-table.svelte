<script lang="ts">
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderSnippet } from '$lib/components/ui/data-table';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import CreateInstrumentButton from './create-instrument-button.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator
	} from '$lib/components/ui/dropdown-menu';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import EditInstrumentDialog from './edit-instrument-dialog.svelte';
	import DeleteInstrumentDialog from './delete-instrument-dialog.svelte';

	const columns: ColumnDef<Tables<'instruments'>>[] = [
		{
			accessorKey: 'name',
			header: 'Instrument'
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderSnippet(Actions, { row: row.original });
			}
		}
	];

	let { data }: { data: Tables<'instruments'>[] } = $props();

	let editInstrumentDialog = $state({
		open: false,
		instrument: null as Tables<'instruments'> | null
	});
	let deleteInstrumentDialog = $state({
		open: false,
		instrument: null as Tables<'instruments'> | null
	});

	let table = $derived(createSvelteTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	}));
</script>

<div class="flex flex-col gap-2 max-w-sm">
	<div class="flex justify-end">
		<CreateInstrumentButton />
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
					<TableRow data-state={row.getIsSelected() && "selected"}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableCell>
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</TableCell>
						{/each}
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

<EditInstrumentDialog bind:open={editInstrumentDialog.open} instrument={editInstrumentDialog.instrument} />
<DeleteInstrumentDialog bind:open={deleteInstrumentDialog.open} instrument={deleteInstrumentDialog.instrument} />

{#snippet Actions({ row }: {row: Tables<'instruments'>})}
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
			<DropdownMenuItem onclick={() => editInstrumentDialog = {open: true, instrument: row}}>
				Bewerken
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem variant="destructive" onclick={() => deleteInstrumentDialog = {open: true, instrument: row}}>
				Verwijderen
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}
