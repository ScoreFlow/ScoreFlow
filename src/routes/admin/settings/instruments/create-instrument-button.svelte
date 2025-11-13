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
  import { createInstrument } from "$lib/remote/admin/scores.remote"
  import { createInstrumentSchema } from "$lib/schemas/remote/admin/scores"

  const id = $props.id()
</script>


<Dialog>
	<DialogTrigger class={buttonVariants({variant: 'outline', size: 'sm'})}>
		<PlusIcon />
		<span class="hidden lg:inline">Instrument toevoegen</span>
	</DialogTrigger>
	<DialogContent>
		<form {...createInstrument.preflight(createInstrumentSchema)}>
			<DialogHeader>
				<DialogTitle>
					Instrument toevoegen
				</DialogTitle>
			</DialogHeader>
			<div class="grid grid-cols-[auto_1fr] gap-4 py-4">
				<Label class="text-right" for="name-{id}">Naam</Label>
				<Input {...createInstrument.fields.name.as('text')} class="grow" id="name-{id}" required />

				<Issues class="col-span-2" issues={createInstrument.fields.allIssues()} />

				{#if (createInstrument.result?.success)}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>Het instrument is toegevoegd</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">
					{#if createInstrument.pending}
						<Spinner />
					{:else}
						Toevoegen
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>