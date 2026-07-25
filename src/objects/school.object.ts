import { ClassObject } from "./class.object";
import { Student } from "./student.object";
import { User } from "./user.object";
import { ViolationType } from "./violation-type.object";
import { Violation } from "./violation.object";
import { SchoolModeObject } from "./school-mode.object";

export class SchoolObject {
  public id?: number;
  public name?: string;
  public phone?: string;
  public address?: string;
  public email?: string;
  public slug?: string;
  public start_date?: string;
  public description?: string;
  public is_demo?: boolean;
  public is_active?: boolean;
  public image?: number;
  public students_limit?: number;
  public students_count?: number;
  public violation_type_limit?: number;
  public violation_types_count?: number;
  public violation_limit?: number;
  public violations_count?: number;
  public classes_limit?: number;
  public class_count?: number;
  public user_limit?: number;
  public classes?: ClassObject[];
  public students?: Student[];
  public users?: User[];
  public violations?: Violation[];
  public violation_types?: ViolationType[];
  public mode_id?: number;
  public mode?: SchoolModeObject;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
}
