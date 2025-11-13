<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils/ui';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	{...restProps}
	bind:this={ref}
	class={cn("flex max-w-sm flex-col items-center gap-2 text-center", className)}
	data-slot="empty-header"
>
	{@render children?.()}
</div>
