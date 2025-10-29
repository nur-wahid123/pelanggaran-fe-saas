import { RoleEnum } from "@/enums/role.enum";
import { SchoolInfo } from "@/objects/school-info.object";
import { UserInfo } from "@/objects/user-info.object";
import { createContext } from "react";

export const AppContext = createContext<{
  user: UserInfo;
  isLoading: boolean;
  refreshData: () => void;
  school: SchoolInfo;
  error: string | null;
  // setProfile: (name: string, email: string, username: string) => void;
}>({
  error: "",
  school: {
    logo: 0,
    name: "",
    address: "",
  },
  user: {
    username: "",
    name: "",
    sub: 0,
    email: "",
    role: RoleEnum.USER,
  },
  isLoading: true,
  refreshData: () => {},
  // setProfile: () => {},
});
