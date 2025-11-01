<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { updateInstrument } from '$lib/remote/admin/scores.remote';
	import { Input } from '$lib/components/ui/input';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Issues } from '$lib/components/issues';
	import { updateInstrumentSchema } from '$lib/schemas/remote/admin/scores';
	import type { Tables } from '$lib/types/database.types';

	let { open = $bindable(false), instrument }: { open: boolean, instrument: Tables<'instruments'> | null } = $props();

	const id = $props.id();
</script>


<Dialog bind:open>
	<DialogContent>
		<form {...updateInstrument.preflight(updateInstrumentSchema)}>
			<input {...updateInstrument.fields.id.as('hidden', instrument?.id ?? '')} />
			<DialogHeader>
				<DialogTitle>
					Instrument bewerken
				</DialogTitle>
				<DialogDescription>
					Bewerk de naam van het instrument
					<span class="text-foreground">
						'{instrument?.name}'
						</span>
				</DialogDescription>
			</DialogHeader>
			<div class="grid grid-cols-[auto_1fr] gap-4 py-4">
				<Label class="text-right" for="name-{id}">Naam</Label>
				<Input {...updateInstrument.fields.name.as('text')} class="grow" id="name-{id}" required
							 value={instrument?.name ?? ''} />

				<Issues class="col-span-2" issues={updateInstrument.fields.allIssues()} />

				{#if (updateInstrument.result?.success)}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>De naam van het instrument is aangepast</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<Button type="submit">
					{#if updateInstrument.pending}
						<Spinner />
					{:else}
						Opslaan
					{/if}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>

