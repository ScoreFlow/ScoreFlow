<script lang="ts">
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import CreateInstrumentButton from './create-instrument-button.svelte';
	import type { Tables } from '$lib/types/database.types';

	const columns: ColumnDef<Tables<'instruments'>>[] = [
		{
			accessorKey: 'name',
			header: 'Instrument'
		}
	];

	let { data }: { data: Tables<'instruments'>[] } = $props();

	let table = $derived(createSvelteTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	}));
</script>

<div class="flex flex-col gap-2">
	<div class="flex justify-end">
		<CreateInstrumentButton />
	</div>
	<div class="rounded-md border">
		<Table>
			<TableHeader class="bg-muted sticky top-0 z-10">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<TableRow>
						<TableHead class="w-8"></TableHead>
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
						<TableCell />
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