"use client";

import * as React from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function TeamSwitcherSuper() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5 rounded-lg transition-colors data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar className="w-8 h-8 shadow">
            <AvatarFallback className="bg-primary text-white text-sm font-bold">
              {"S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="truncate font-semibold text-sm">SUPERADMIN</span>
            <span className="truncate text-xs text-muted-foreground">
              POJOK PONGGOK BLITAR
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
