<script lang="ts" module></script>

<script lang="ts">
	import {
		Sidebar,
		SidebarContent,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem
	} from '$lib/components/ui/sidebar';
	import NavManagement from './nav-management.svelte';
	import { navData as data } from '$lib/components/admin-sidebar/index';
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
	<SidebarContent>
		<NavManagement items={data.navManagement} />
	</SidebarContent>
</Sidebar>