<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn, type WithElementRef } from "$lib/utils/ui"

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
	{...restProps}
	bind:this={ref}
	class={cn("text-lg font-medium tracking-tight", className)}
	data-slot="empty-title"
>
	{@render children?.()}
</div>
