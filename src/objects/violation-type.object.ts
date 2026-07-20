import { SchoolObject } from "./school.object";
import { Violation } from "./violation.object";

export interface ViolationTypeDetailDto {
  id?: number;

  name?: string;

  point: number;

  violations?: Violation[];

  school?: SchoolObject;

  total_violated?: number;

  total_student?: number;
}

export interface ViolationType {
  id?: number;

  name?: string;

  point: number;

  violations?: Violation[];

  school?: SchoolObject;

}
