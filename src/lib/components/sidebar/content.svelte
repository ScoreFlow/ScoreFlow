<script lang="ts">
	import { type MenuItem } from './';
	import {
		SidebarContent,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarMenuSub,
		SidebarMenuSubButton,
		SidebarMenuSubItem
	} from '$lib/components/ui/sidebar';

	let { items, title }: { items: MenuItem[], title: string } = $props();
</script>

<SidebarContent>
	<SidebarGroup>
		<SidebarGroupLabel>{title}</SidebarGroupLabel>
		<SidebarMenu>
			{#each items as item (item.title)}
				<SidebarMenuItem>
					<SidebarMenuButton tooltipContent={item.title}>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								{#if item.icon}
									<item.icon />
								{/if}
								<span>{item.title}</span>
							</a>
						{/snippet}
					</SidebarMenuButton>
					{#if item.items}
						<SidebarMenuSub>
							{#each item.items as subItem (subItem.title)}
								<SidebarMenuSubItem>
									<SidebarMenuSubButton href={subItem.url}>
										{subItem.title}
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							{/each}
						</SidebarMenuSub>
					{/if}
				</SidebarMenuItem>
			{/each}
		</SidebarMenu>
	</SidebarGroup>
</SidebarContent>