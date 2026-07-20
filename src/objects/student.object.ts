import { ClassObject } from "./class.object";
import { SchoolObject } from "./school.object";
import { Violation } from "./violation.object";

export class Student {
  public id?: number;

  public total_points?: number;

  public name?: string;

  public school_student_id?: string;

  public national_student_id?: string;

  public violations?: Violation[];

  public student_class?: ClassObject;

  public school?: SchoolObject;
}

export class StudentDto {
  public id?: number;

  public total_points?: number;

  public violation_count?: number;

  public name?: string;

  public school_student_id?: string;

  public national_student_id?: string;

  public violations?: Violation[];

  public student_class?: ClassObject;

  public school?: SchoolObject;
}
