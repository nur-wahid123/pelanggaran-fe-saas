import { RoleEnum } from "@/enums/role.enum";

export class UserInfo {
    username?: string;
    name?: string;
    sub?: number;
    email?: string;
    role?: RoleEnum;
    school_id?: number;
    is_demo?: boolean;
    start_date?: string;
    image?: number
  }