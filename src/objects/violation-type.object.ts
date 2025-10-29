import { SchoolObject } from "./school.object";
import { Violation } from "./violation.object";

export interface ViolationType {
  id?: number;

  name?: string;

  point: number;

  violations?: Violation[];

  school?: SchoolObject;

}
