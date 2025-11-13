<script lang="ts">
	import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '$lib/components/ui/empty';
  import { Skeleton } from "$lib/components/ui/skeleton"
  import { getGroups } from "$lib/remote/admin/groups.remote"
	import CreateGroupButton from './create-group-button.svelte';
  import GroupCard from "./group-card.svelte"
</script>

<h1 class="text-2xl font-bold mb-8">Groepen</h1>

<svelte:boundary>
	<div class="flex flex-col gap-2">
		<div class="flex justify-end">
			<CreateGroupButton />
		</div>

		{#await getGroups()}
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<Skeleton class="h-24 w-full" />
				<Skeleton class="h-24 w-full" />
				<Skeleton class="h-24 w-full" />
				<Skeleton class="h-24 w-full" />
				<Skeleton class="h-24 w-full" />
			</div>
		{:then groups}
			{#if groups.length > 0}
				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each groups as group}
						<GroupCard {group} />
					{/each}
				</div>
			{:else}
				<Empty class="bg-muted w-full">
					<EmptyHeader>
						<EmptyTitle>Geen groepen gevonden</EmptyTitle>
						<EmptyDescription>Maak een nieuwe groep aan</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<CreateGroupButton collapse={false} />
					</EmptyContent>
				</Empty>
			{/if}
		{/await}
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