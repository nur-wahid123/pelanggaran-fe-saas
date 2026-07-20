"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Inter } from "next/font/google";
import "./../globals.css";
import { AppBreadcrumb } from "@/user-components/dashboard/breadcrumb.component";
import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { RoleEnum } from "@/enums/role.enum";
import { UserInfo } from "@/objects/user-info.object";
import { changeFavicon, getImage } from "@/util/util";
import { AppContext } from "@/user-components/contexts/app.context";
import { SchoolInfo } from "@/objects/school-info.object";
import { SchoolObject } from "@/objects/school.object";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "force-static";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const [user, setUser] = useState<UserInfo>({
    username: "",
    name: "",
    sub: 0,
    email: "",
    role: RoleEnum.USER,
    school_id: 0,
    is_demo: true,
  });

  const [school, setSchool] = useState<SchoolInfo>({
    address: "",
    logo: 0,
    name: ""
  });
  const [loading, setLoading] = useState(true);
  const fetchUser = useCallback(async () => {
    setLoading(true);
    await axiosInstance.get(`${ENDPOINT.ME}`).then((res) => {
      const getUser: UserInfo = res.data.data;
      setUser(getUser);
      fetchSchool(getUser)
      setLoading(false);
    });
  }, [user, setUser]);

  const fetchSchool = useCallback(async (userr: UserInfo) => {
    await axiosInstance.get(`${ENDPOINT.DETAIL_SCHOOL_ADMIN}/${userr.school_id}`).then(async res => {
      const getSchool: SchoolObject = res.data.data;
      const img = await getImage(getSchool.image ?? 0)
      setSchool({
        address: getSchool.address,
        logo: img,
        name: getSchool.name
      })
      changeFavicon(`${ENDPOINT.DETAIL_IMAGE}/${img}`);
    })
  }, [])

  useEffect(() => {
    fetchUser();
  }, []);


  return (
    <AppContext.Provider
      value={{
        user,
        isLoading: loading,
        refreshData: fetchUser,
        error: null,
        school
      }}
    >
      <div className={inter.className + " max-h-screen"}>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-screen">
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <AppBreadcrumb />
                </div>
              </header>
              <div className="flex flex-1 flex-col h-full gap-4 p-4 pt-0">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </QueryClientProvider>
      </div>
    </AppContext.Provider>
  );
}
