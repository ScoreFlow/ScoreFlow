import DrumIcon from "@lucide/svelte/icons/drum"
import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard"
import MusicIcon from "@lucide/svelte/icons/music"
import SettingsIcon from "@lucide/svelte/icons/settings"
import type { Component } from "svelte"

export interface MenuItem {
  title: string
  url: string
  isActive?: boolean
  icon?: Component
  items?: { title: string; url: string }[]
}

export const navData: {
  navAdmin: MenuItem[]
} = {
  navAdmin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon
    },
    {
      title: "Muziekstukken",
      url: "/admin/parts",
      icon: MusicIcon,
      items: [
        {
          title: "Uploaden",
          url: "/admin/parts/upload"
        }
      ]
    },
    {
      title: "Concerten",
      url: "/admin/concerts",
      icon: DrumIcon
    },
    {
      title: "Instellingen",
      url: "/admin/settings",
      icon: SettingsIcon,
      items: [
        {
          title: "Groepen",
          url: "/admin/settings/groups"
        },
        {
          title: "Instrumenten",
          url: "/admin/settings/instruments"
        },
        {
          title: "Gebruikers",
          url: "/admin/settings/users"
        }
      ]
    }
  ]
}
