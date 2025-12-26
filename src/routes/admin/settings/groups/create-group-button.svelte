<script lang="ts">
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check"
  import PlusIcon from "@lucide/svelte/icons/plus"
  import { Issues } from "$lib/components/issues"
  import { Alert, AlertDescription } from "$lib/components/ui/alert"
  import { Button, buttonVariants } from "$lib/components/ui/button"
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "$lib/components/ui/dialog"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Spinner } from "$lib/components/ui/spinner"
  import { createGroup } from "$lib/remote/admin/groups.remote"
  import { createGroupSchema } from "$lib/schemas/remote/admin/groups"

  let { collapse = true } = $props()

  const id = $props.id()
</script>


<Dialog>
	<DialogTrigger class={buttonVariants({variant: 'outline', size: 'sm'})}>
		<PlusIcon />
		<span class={collapse ? 'hidden lg:inline': ''}>Groep aanmaken</span>
	</DialogTrigger>
	<DialogContent>
		<form {...createGroup.preflight(createGroupSchema)}>
			<DialogHeader>
				<DialogTitle>
					Groep aanmaken
				</DialogTitle>
			</DialogHeader>
			<div class="grid grid-cols-[auto_1fr] gap-4 py-4">
				<Label class="text-right" for="name-{id}">Naam</Label>
				<Input {...createGroup.fields.name.as('text')} class="grow" id="name-{id}" required />

				<Issues class="col-span-2" issues={createGroup.fields.allIssues()} />

				{#if (createGroup.result?.success)}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>De groep is aangemaakt</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">
					{#if createGroup.pending}
						<Spinner />
					{:else}
						Toevoegen
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>