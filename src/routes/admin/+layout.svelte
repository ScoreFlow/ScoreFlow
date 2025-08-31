<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import { AdminSidebar, Trigger } from '$lib/components/admin-sidebar';
	import { Copyright } from '$lib/components/copyright';

	let { children } = $props();
</script>

<SidebarProvider>
	<AdminSidebar />
	<SidebarInset class="flex">
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
			<div class="flex items-center gap-2 px-4">
				<Trigger/>
			</div>
		</header>
		<div class="grow">
			{@render children()}
		</div>
		<Copyright class="py-2"/>
	</SidebarInset>
</SidebarProvider>