<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import type { Tables } from '$lib/types/database.types';
	import { deleteInstrument } from '$lib/remote/admin/scores.remote';
	import { deleteInstrumentSchema } from '$lib/schemas/remote/admin/scores';
	import { DialogClose } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Issues } from '$lib/components/issues';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Spinner } from '$lib/components/ui/spinner';

	let {
		open = $bindable(false),
		instrument
	}: { open: boolean; instrument: Tables<'instruments'> | null } = $props();
</script>

<Dialog bind:open>
	<DialogContent>
		<form {...deleteInstrument.preflight(deleteInstrumentSchema)}>
			<input {...deleteInstrument.fields.id.as('hidden', instrument?.id ?? '')} />
			<DialogHeader>
				<DialogTitle>Instrument verwijderen</DialogTitle>
				<DialogDescription>
					Weet je zeker dat je het instrument
					<span class="text-foreground">
						'{instrument?.name}'
					</span>
					wilt verwijderen?
				</DialogDescription>
			</DialogHeader>
			<div class="flex flex-col gap-4 py-2">
				<Issues class="col-span-2" issues={deleteInstrument.fields.allIssues()} />

				{#if deleteInstrument.result?.success}
					<Alert class="col-span-2">
						<CircleCheckIcon />
						<AlertDescription>Het instrument is verwijderd</AlertDescription>
					</Alert>
				{/if}
			</div>
			<DialogFooter>
				<div class="flex flex-row justify-between w-full gap-4 mt-4">
					<Button type="submit" variant="destructive">
						{#if deleteInstrument.pending}
							<Spinner />
						{:else}
							Verwijderen
						{/if}
					</Button>
					<DialogClose>
						{#snippet child({ props })}
							<Button type="button" variant="outline" {...props}>Annuleren</Button>
						{/snippet}
					</DialogClose>
				</div>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
