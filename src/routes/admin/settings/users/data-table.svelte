<script lang="ts">
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderSnippet } from '$lib/components/ui/data-table';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { type UserData } from '$lib/remote/admin/users.remote';
	import InviteButton from './invite-button.svelte';

	const columns: ColumnDef<UserData>[] = [
		{
			accessorKey: 'email',
			header: 'E-mailadres'
		},
		{
			accessorKey: 'user_metadata.full_name',
			header: 'Naam'
		},
		{
			accessorKey: 'admin',
			header: 'Rol',
			cell: ({ row }) => renderSnippet(Admin, { row: row.original })
		}
	];

	let { data }: { data: UserData[] } = $props();

	const table = createSvelteTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="flex flex-col gap-2">
	<div class="flex justify-end">
		<InviteButton/>
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
				{:else}
					<TableRow>
						<TableCell colspan={columns.length} class="h-24 text-center">
							Er zijn nog geen gebruikers.
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

{#snippet Admin({ row }: {row: UserData})}
	{#if row.admin}
		<Badge variant="secondary">
			Beheerder
		</Badge>
	{:else}
		<Badge variant="outline">
			Gebruiker
		</Badge>
	{/if}
{/snippet}