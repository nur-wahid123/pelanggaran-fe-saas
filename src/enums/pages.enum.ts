// Centralized application routes and path builders.
// This file is additive-only so existing router.push and href usages remain unchanged.

export enum PagesEnum {
  HOME = '/',
  LOGIN = '/login',

  // Dashboard root and static sections
  DASHBOARD = '/dashboard',
  DASHBOARD_VIOLATION = '/dashboard/violation',
  DASHBOARD_VIOLATION_TYPE = '/dashboard/violation-type',
  DASHBOARD_INPUT_VIOLATION = '/dashboard/input-violation',
  DASHBOARD_CLASS = '/dashboard/class-page',
  DASHBOARD_PROFILE = '/dashboard/profile',
  DASHBOARD_SETTINGS = '/dashboard/settings',
  DASHBOARD_USER = '/dashboard/user',
  DASHBOARD_STUDENT = '/dashboard/student',

  // Superadmin
  SUPERADMIN = '/superadmin',
  SUPERADMIN_SCHOOL = '/superadmin/school',
  SUPERADMIN_SCHOOL_ADD = '/superadmin/school/add',
  SUPERADMIN_SCHOOL_EDIT = '/superadmin/school/edit',
}

// Dynamic route helpers (typed builders)
export const PagePaths = {
  // Dashboard dynamic pages
  dashboardViolationDetail: (slug: string | number) => `${PagesEnum.DASHBOARD_VIOLATION}/${slug}`,
  dashboardViolationTypeDetail: (slug: string | number) => `${PagesEnum.DASHBOARD_VIOLATION_TYPE}/${slug}`,
  dashboardStudentDetail: (slug: string | number) => `${PagesEnum.DASHBOARD_STUDENT}/${slug}`,
  dashboardInputViolationConfirmation: (id: string | number) => `${PagesEnum.DASHBOARD}/input-violation-confirmation/${id}`,
  superadminSchoolDetail: (slug: string | number) => `${PagesEnum.SUPERADMIN_SCHOOL}/${slug}`,
  superadminSchoolEdit: (slug: string | number) => `${PagesEnum.SUPERADMIN_SCHOOL_EDIT}/${slug}`,
} as const;

export type StaticPagePath = `${PagesEnum}`;

export type DynamicPageBuilder = typeof PagePaths[keyof typeof PagePaths];

export const AllStaticPages: ReadonlyArray<StaticPagePath> = [
  PagesEnum.HOME,
  PagesEnum.LOGIN,
  PagesEnum.DASHBOARD,
  PagesEnum.DASHBOARD_VIOLATION,
  PagesEnum.DASHBOARD_VIOLATION_TYPE,
  PagesEnum.DASHBOARD_INPUT_VIOLATION,
  PagesEnum.DASHBOARD_CLASS,
  PagesEnum.DASHBOARD_PROFILE,
  PagesEnum.DASHBOARD_SETTINGS,
  PagesEnum.DASHBOARD_USER,
  PagesEnum.DASHBOARD_STUDENT,
  PagesEnum.SUPERADMIN,
  PagesEnum.SUPERADMIN_SCHOOL,
  PagesEnum.SUPERADMIN_SCHOOL_ADD,
];
