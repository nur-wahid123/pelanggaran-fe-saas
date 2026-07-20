import { RoleEnum } from "@/enums/role.enum";
import { Violation } from "./violation.object";
import { SchoolObject } from "./school.object";

export interface User {
  id?: number;

  name?: string;

  username?: string;

  password?: string;

  is_active?: boolean;

  email?: string;

  role?: RoleEnum;

  violations?: Violation[];

  school?: SchoolObject;

  total_violation?: number;

}
