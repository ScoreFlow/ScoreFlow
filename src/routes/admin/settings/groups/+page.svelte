<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { getGroups } from "$lib/remote/admin/groups.remote"
  import GroupCard from "./group-card.svelte"
</script>

<h1 class="text-2xl font-bold mb-8">Groepen</h1>

<svelte:boundary>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each await getGroups() as group}
			<GroupCard {group} />
		{/each}
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