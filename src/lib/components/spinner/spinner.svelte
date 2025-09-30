<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';
	import type { IconProps } from '@lucide/svelte';

	export const spinnerVariants = tv({
		base: 'animate-spin',
		variants: {
			size: {
				default: 'size-6',
				sm: 'size-4',
				lg: 'size-10'
			}
		}
	});

	export type SpinnerSize = VariantProps<typeof spinnerVariants>['size'];

	export type SpinnerProps = Omit<IconProps, 'size'> & {
		size?: SpinnerSize;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils/ui';
	import { LoaderCircleIcon } from '@lucide/svelte';

	let { class: className, size = 'default', strokeWidth = 3, ...restProps }: SpinnerProps = $props();
</script>

<LoaderCircleIcon
	class={cn(spinnerVariants({ size }), className)}
	{strokeWidth}
	{...restProps}
/>