"use client"

import {
  ChevronsUpDown,
  LogOut,
  LogsIcon,
  User2Icon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { logout } from "@/util/request.util"
import Link from "next/link"
import { UserInfo } from "@/objects/user-info.object"
import { useRouter } from "next/navigation"

export function NavUser({
  isSuperadmin = false,
  user,
}: {
  isSuperadmin?: boolean
  user: UserInfo
}) {
  const { isMobile } = useSidebar()
  const initials = user.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "U";
  const router = useRouter()
  const logouto = () => {
    const slug = localStorage.getItem("schoolSlug");
    console.log(slug);
    logout()
    if (slug) {
      router.push(`/login/${slug}`);
    } else {
      router.push('/login');
    }
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={''} alt={user.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name || "User"}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email || "No email"}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={''} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name || "User"}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email || "No email"}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="flex items-center gap-2" href={isSuperadmin ? `/superadmin/profile` : `/dashboard/profile`}>
                <User2Icon className="size-4" aria-hidden="true" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="flex items-center gap-2" href={`/dashboard/user-logs`}>
                <LogsIcon className="size-4" aria-hidden="true" />
                <span>Log User</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { logouto() }}
              className="flex items-center gap-2 text-destructive"
              aria-label="Log out"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
