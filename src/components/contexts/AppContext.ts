import { RoleEnum } from "@/enums/role.enum";
import { UserInfo } from "@/objects/user-info.object";
import { createContext } from "react";

export const AppContext = createContext<{
  user: UserInfo;
  isLoading: boolean;
  refreshData: () => void;
  setProfile: (name: string, email: string, username: string) => void;
  setImage: (image: number) => void;
  image?: number | undefined
}>({
  image:0,
  user: {
    username: "",
    name: "",
    sub: 0,
    email: "",
    role: RoleEnum.USER,
    school_id: 0,
    is_demo: true,
    start_date: "",
    image: 0,
  },
  isLoading: true,
  refreshData: () => {},
  setProfile: () => {},
  setImage: () => {},
});
