<script lang="ts" module></script>

<script lang="ts">
	import {
		Sidebar,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		useSidebar
	} from '$lib/components/ui/sidebar';
	import Content from './content.svelte';
	import { navData } from './index';
	import { beforeNavigate } from '$app/navigation';

	const sidebar = useSidebar();

	beforeNavigate(() => {
		sidebar.setOpenMobile(false);
	});
</script>


<Sidebar collapsible="icon" variant="inset">
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<a href="/admin/dashboard">
					<SidebarMenuButton size="lg">
						<div
							class="flex items-center justify-center aspect-square size-6 group-data-[collapsible=icon]:p-1.5 transition-[padding]">
							<img alt="Logo" src="/favicon.png" />
						</div>
						<span class="text-primary font-medium text-xl ml-2">ScoreFlow</span>
					</SidebarMenuButton>
				</a>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>
	<Content items={navData.navAdmin} title="Beheer" />
</Sidebar>