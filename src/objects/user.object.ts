import { RoleEnum } from "@/enums/role.enum";
import { Violation } from "./violation.object";
import { SchoolObject } from "./school.object";

export interface User {
  id?: number;

  name?: string;

  username?: string;

  password?: string;

  email?: string;

  role?: RoleEnum;

  violations?: Violation[];

  school?: SchoolObject;

}
