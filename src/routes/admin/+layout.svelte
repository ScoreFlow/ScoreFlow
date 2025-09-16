<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import { AdminSidebar, Trigger } from '$lib/components/sidebar';
	import { Copyright } from '$lib/components/copyright';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { children } = $props();
</script>

{#snippet pending()}
	<div class="absolute top-0 left-0 right-0 bottom-0 z-10 bg-background py-4 px-8 flex flex-col gap-4 max-w-4xl">
		<Skeleton class="h-6 w-40" />
		<Skeleton class="h-6 w-60" />
		<div class="flex flex-row flex-wrap gap-4 max-w-200">
			<Skeleton class="aspect-square w-40 xl:w-96"></Skeleton>
			<Skeleton class="aspect-square w-40 xl:w-96"></Skeleton>
			<Skeleton class="aspect-square w-40 xl:w-96"></Skeleton>
			<Skeleton class="aspect-square w-40 xl:w-96"></Skeleton>
		</div>
	</div>
{/snippet}

<SidebarProvider>
	<AdminSidebar />
	<SidebarInset class="flex">
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
			<div class="flex items-center gap-2 px-4">
				<Trigger />
			</div>
		</header>
		<div class="relative grow py-4 px-8">
			<svelte:boundary {pending}>
				{@render children()}

				{#if $effect.pending()}
					{@render pending()}
				{/if}
			</svelte:boundary>
		</div>
		<Copyright class="py-2" />
	</SidebarInset>
</SidebarProvider>