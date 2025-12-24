import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconKey,
  IconSend,
  IconSettings,
  IconServer,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react"
import { Link } from "react-router"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "User Management",
      url: "/users",
      icon: IconUser,
    },
    {
      title: "Invitations",
      url: "/invitations",
      icon: IconSend,
    },
    {
      title: "API Keys",
      url: "/api-keys",
      icon: IconKey,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Foo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.navClouds} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  )
}
