import { SchoolObject } from "./school.object";
import { Student } from "./student.object";

export class ClassObject {
  id!: number;

  name?: string;

  students?: Student[];

  school?: SchoolObject;
}
