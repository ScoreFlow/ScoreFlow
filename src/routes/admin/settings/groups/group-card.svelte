<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right"
  import UsersIcon from "@lucide/svelte/icons/users"
  import { Card, CardContent, CardDescription, CardTitle } from "$lib/components/ui/card"
  import { getGroupMembers } from "$lib/remote/admin/groups.remote"
  import type { Tables } from "$lib/types/database.types"

  const { group }: { group: Tables<"groups"> } = $props()

  let members = $derived(await getGroupMembers({ id: group.id }))
</script>


<a href={`/admin/settings/groups/${group.id}`}>
	<Card class="shadow-xs hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50">
		<CardContent class="flex flex-row items-center justify-between">
			<div class="flex flex-col gap-2">
				<CardTitle>{group.name}</CardTitle>
				<CardDescription class="grid items-center grid-cols-2 gap-2 w-fit">
					<UsersIcon size={16} />
					<span class="sr-only">Aantal leden: </span>
					<span>{members.length}</span>
				</CardDescription>
			</div>
			<ChevronRightIcon class="text-muted-foreground" />
		</CardContent>
	</Card>
</a>