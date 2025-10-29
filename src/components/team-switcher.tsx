"use client";

import * as React from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import ENDPOINT from "@/config/url";
import { AppContext } from "@/user-components/contexts/app.context";

export function TeamSwitcher() {
  const { isLoading: loading, error, school } = React.useContext(AppContext);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="grid grid-cols-5 items-center gap-2 px-1 py-1.5 rounded-lg transition-colors data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex col-span-1 aspect-square size-10 items-center justify-center rounded-lg bg-muted text-sidebar-primary-foreground border border-sidebar-border overflow-hidden">
            {loading ? (
              <span className="text-xs text-muted-foreground">...</span>
            ) : (school?.logo !== undefined) ? (
              <img
                src={`${ENDPOINT.DETAIL_IMAGE}/${school.logo}`}
                alt={school.name || "School Logo"}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs text-muted-foreground">N/A</span>
            )}
          </div>
          <div className="flex col-span-4 flex-col min-w-0">
            <span className="truncate font-semibold text-sm">
              {loading ? "Loading..." : school?.name || "School Name"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {loading ? "" : school?.address || "School Address"}
            </span>
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
