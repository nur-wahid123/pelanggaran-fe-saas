import { LogTypeEnum } from "@/enums/log-type.enum";
import { User } from "./user.object";

export class LogObject {
  public id?: number;

  public message?: string;

  public metadata?: Record<string, any>;

  public logType?: LogTypeEnum | string;

  public user?: User;

  public date: Date = new Date

}
