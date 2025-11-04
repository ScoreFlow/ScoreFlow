<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		'flex flex-wrap gap-x-1 justify-center text-center text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-xs',
		className
	)}
	{...restProps}
>
	<span>Copyright © 2025 Yorick Nap en Niels Krijnen.</span>
	<span>Alle rechten voorbehouden.</span>
</div>
