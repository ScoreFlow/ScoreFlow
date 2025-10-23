<script lang="ts">
	import DataTable from './data-table.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getUsers } from '$lib/remote/admin/users.remote';
</script>

<h1 class="text-2xl font-bold mb-4">Gebruikers</h1>
<svelte:boundary>
	{#snippet pending()}
		<div class="grid grid-cols-3 gap-4 mt-12">
			<Skeleton class="h-8 col-span-3" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
			<Skeleton class="h-8" />
		</div>
	{/snippet}

	<DataTable data={await getUsers()} />

</svelte:boundary>