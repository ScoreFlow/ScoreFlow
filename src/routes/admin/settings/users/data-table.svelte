<script lang="ts">
	import { type ColumnDef, getCoreRowModel } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderSnippet } from '$lib/components/ui/data-table';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { type UserData } from '$lib/types/users.types';
	import InviteButton from './invite-button.svelte';
	import { getRoleDisplayName } from '$lib/utils/auth';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator
	} from '$lib/components/ui/dropdown-menu';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import ManageRolesDialog from './manage-roles-dialog.svelte';
	import DeleteUserDialog from './delete-user-dialog.svelte';

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
			accessorKey: 'roles',
			header: 'Rol',
			cell: ({ row }) => renderSnippet(Roles, { row: row.original })
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderSnippet(Actions, { row: row.original });
			}
		}
	];

	let { data }: { data: UserData[] } = $props();

	let manageRolesDialog = $state({
		open: false,
		user: null as UserData | null
	});
	let deleteUserDialog = $state({
		open: false,
		user: null as UserData | null
	});

	const table = createSvelteTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="flex flex-col gap-2 max-w-2xl">
	<div class="flex justify-end">
		<InviteButton />
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

<ManageRolesDialog bind:open={manageRolesDialog.open} user={manageRolesDialog.user} />
<DeleteUserDialog bind:open={deleteUserDialog.open} user={deleteUserDialog.user} />

{#snippet Roles({ row }: {row: UserData})}
	{#if row.roles.length === 0}
		<span class="text-muted-foreground">-</span>
	{:else}
		{#each row.roles as role}
			<Badge variant="secondary">
				{getRoleDisplayName(role)}
			</Badge>
		{/each}
	{/if}
{/snippet}

{#snippet Actions({ row }: {row: UserData})}
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
			<DropdownMenuItem onclick={() => manageRolesDialog = {open: true, user: row}}>
				Rollen beheren
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem variant="destructive" onclick={() => deleteUserDialog = {open: true, user: row}}>
				Verwijderen
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
{/snippet}