"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  HomeIcon,
  SchoolIcon,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcherSuper } from "./team-switcher-super"
import { AppContext } from "@/user-components/contexts/app.context"

const data = {
  user: {
    name: "Fajar",
    email: "fajar@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SMAN 1 Srengat",
      logo: GalleryVerticalEnd,
      plan: "Bagelenan, Blitar",
    },
  ],
  projects: [
    {
      name: "Superadmin",
      url: "/superadmin",
      icon: HomeIcon,
      className: "font-semibold",
    },
    {
      name: "Sekolah",
      url: "/superadmin/school",
      icon: SchoolIcon,
      className: "font-medium",
    },
    {
      name: "Mode Sekolah",
      url: "/superadmin/school-modes",
      icon: GalleryVerticalEnd,
      className: "font-medium",
    },
  ],
}

export function AppSidebarSuper({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = React.useContext(AppContext)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcherSuper />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects title="User" projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser isSuperadmin={true} user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
