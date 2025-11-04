<script lang="ts">
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { cn } from '$lib/utils/ui';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		issues?: { message: string }[] | undefined;
	} & HTMLAttributes<HTMLDivElement>;

	let { class: className, issues, ...restProps }: Props = $props();
</script>

{#if (issues ?? []).length > 0}
	<div class={cn('flex flex-col gap-2', className)} {...restProps}>
		{#each issues ?? [] as issue}
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertDescription>{issue.message}</AlertDescription>
			</Alert>
		{/each}
	</div>
{/if}
