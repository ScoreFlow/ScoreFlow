<script lang="ts">
  import { Issues } from "$lib/components/issues"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { getInstruments } from "$lib/remote/admin/scores.remote"
  import DataTable from "./data-table.svelte"
</script>

<h1 class="text-2xl font-bold mb-4">Instrumenten</h1>

{#await getInstruments()}
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
{:then data}

	<DataTable {data} />

{:catch _error}
	<Issues
		issues={[{message: 'Er is een fout opgetreden bij het laden van de instrumenten. Probeer het later opnieuw.'}]} />
{/await}