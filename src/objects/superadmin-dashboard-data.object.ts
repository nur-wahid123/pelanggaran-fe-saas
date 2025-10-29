export class SuperadminDashboardDataObject {
  total_inactive_school?: number;
  total_active_school?: number;
  total_violations?: number;
  total_users?: number;
  total_students?: number;
  most_violation_school?: {
    id: number;
    name: string;
    violationCount: number;
  };
  violations_this_month?: number;
  violations_last_month?: number;
}
