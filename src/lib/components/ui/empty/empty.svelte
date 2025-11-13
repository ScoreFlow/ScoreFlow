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
	class={cn(
		"flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
		className
	)}
	data-slot="empty"
>
	{@render children?.()}
</div>
