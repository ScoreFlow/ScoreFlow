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
		"text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
		className
	)}
	data-slot="empty-description"
>
	{@render children?.()}
</div>
