<script>
	import { Card } from '$lib/components/ui/card';
	import { cn } from '$lib/utils/ui';
	import { page } from '$app/state';
	import { Copyright } from '$lib/components/copyright';

	let { children } = $props();
</script>

<div class="bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
	<div class={cn('w-full max-w-sm', {
		'md:max-w-3xl': page.url.pathname === '/auth/login'
	})}>
		<div class="flex flex-col gap-6">
			<Card class="overflow-hidden p-0">
				{@render children()}
			</Card>
			<Copyright/>
		</div>
	</div>
</div>