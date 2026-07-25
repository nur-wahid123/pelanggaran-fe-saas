import CONFIG from "./config";

const ENDPOINT = {
  //School
  SCHOOL_CREATE: `${CONFIG.BASE_URL}/school/create`,
  DETAIL_SCHOOL: `${CONFIG.BASE_URL}/school/detail`,
  DETAIL_SCHOOL_ADMIN: `${CONFIG.BASE_URL}/school/detail-admin`,
  SLUG_SCHOOL: (slug: string) => `${CONFIG.BASE_URL}/school/by-slug/${slug}`,
  MASTER_SCHOOL: `${CONFIG.BASE_URL}/school/list`,
  REMOVE_SCHOOL: (slug: string) => `${CONFIG.BASE_URL}/school/remove/${slug}`,
  UPDATE_SCHOOL: `${CONFIG.BASE_URL}/school/update`,
  ADMIN_UPDATE_SCHOOL: `${CONFIG.BASE_URL}/school/admin/update`,
  IMPERSONATE_USER: `${CONFIG.BASE_URL}/auth/impersonate-login`,
  //IsDemo
  IS_DEMO: `${CONFIG.BASE_URL}/school/isdemo`,

  //School Modes
  SCHOOL_MODES_LIST: `${CONFIG.BASE_URL}/school-modes/list`,
  SCHOOL_MODES_DETAIL: (id: number) => `${CONFIG.BASE_URL}/school-modes/detail/${id}`,
  SCHOOL_MODES_CREATE: `${CONFIG.BASE_URL}/school-modes/create`,
  SCHOOL_MODES_UPDATE: (id: number) => `${CONFIG.BASE_URL}/school-modes/update/${id}`,
  SCHOOL_MODES_DELETE: (id: number) => `${CONFIG.BASE_URL}/school-modes/delete/${id}`,

  //Student
  STUDENT_CREATE_BATCH: `${CONFIG.BASE_URL}/student/create-batch`,
  STUDENT_CREATE: `${CONFIG.BASE_URL}/student/create`,
  DETAIL_STUDENT: `${CONFIG.BASE_URL}/student/detail`,
  MASTER_STUDENT: `${CONFIG.BASE_URL}/student/list`,
  MASTER_STUDENT_SEARCH: `${CONFIG.BASE_URL}/student/search-list`,
  EXPORT_STUDENT: `${CONFIG.BASE_URL}/student/export`,

  //School Profile
  SCHOOL_LOGO: `${CONFIG.BASE_URL}/school-profile/school-logo`,
  SCHOOL_NAME: `${CONFIG.BASE_URL}/school-profile/school-name`,
  SCHOOL_ADDRESS: `${CONFIG.BASE_URL}/school-profile/school-address`,
  EDIT_SCHOOL_LOGO: `${CONFIG.BASE_URL}/school-profile/school-logo/edit`,
  EDIT_SCHOOL_ADDRESS: `${CONFIG.BASE_URL}/school-profile/school-address/edit`,
  EDIT_SCHOOL_NAME: `${CONFIG.BASE_URL}/school-profile/school-name/edit`,

  //Image
  UPLOAD_IMAGE: `${CONFIG.BASE_URL}/image/upload`,
  DELETE_IMAGE: `${CONFIG.BASE_URL}/image/delete`,
  LIST_IMAGE: `${CONFIG.BASE_URL}/image/list`,
  DETAIL_IMAGE: `${CONFIG.BASE_URL}/image/get`,

  //Dashboard
  DASHBOARD_DATA: `${CONFIG.BASE_URL}/dashboard/data`,
  SUPERADMIN_DASHBOARD_DATA: `${CONFIG.BASE_URL}/dashboard/superadmin-data`,
  CHART_DATA: `${CONFIG.BASE_URL}/dashboard/chart-data`,

  //Violation Type
  CREATE_VIOLATION: `${CONFIG.BASE_URL}/violation/create`,
  DETAIL_VIOLATION: `${CONFIG.BASE_URL}/violation/detail`,
  UPDATE_VIOLATION: `${CONFIG.BASE_URL}/violation/update`,
  DELETE_VIOLATION: `${CONFIG.BASE_URL}/violation/delete`,
  DELETE_VIOLATION_ALL: `${CONFIG.BASE_URL}/violation/delete/all/vil`,
  MASTER_VIOLATION: `${CONFIG.BASE_URL}/violation/list`,
  SET_EXPORT_VIOLATION: `${CONFIG.BASE_URL}/logger/set-export-violation-data`,
  GET_EXPORT_VIOLATION: `${CONFIG.BASE_URL}/logger/get-export-violation-data`,

  //Violation Type
  CREATE_VIOLATION_TYPE_BATCH: `${CONFIG.BASE_URL}/violation-type/create-batch`,
  CREATE_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/create`,
  DETAIL_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/detail`,
  UPDATE_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/update`,
  DELETE_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/delete`,
  MASTER_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/list`,

  //Class
  CREATE_CLASS: `${CONFIG.BASE_URL}/classes/create`,
  DETAIL_CLASS: `${CONFIG.BASE_URL}/classes/detail`,
  UPDATE_CLASS: `${CONFIG.BASE_URL}/classes/update`,
  DELETE_CLASS: `${CONFIG.BASE_URL}/classes/delete`,
  MASTER_CLASS: `${CONFIG.BASE_URL}/classes/list`,

  //Authentication
  LOGIN: `${CONFIG.BASE_URL}/auth/login`,
  GET_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  LOGOUT: `${CONFIG.BASE_URL}/auth/logout`,
  ME: `${CONFIG.BASE_URL}/auth/me`,
  SELF_EDIT: `${CONFIG.BASE_URL}/auth/edit`,
  PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
  EDIT_PASSWORD: `${CONFIG.BASE_URL}/auth/edit-password`,

  //Users
  CREATE_USER: `${CONFIG.BASE_URL}/users/create`,
  DETAIL_USER: `${CONFIG.BASE_URL}/users/detail`,
  UPDATE_USER: `${CONFIG.BASE_URL}/users/edit`,
  SELF_UPDATE_USER: `${CONFIG.BASE_URL}/users/self-update`,
  DELETE_USER: `${CONFIG.BASE_URL}/users/remove`,
  MASTER_USER: `${CONFIG.BASE_URL}/users/list`,
  GET_USER_LOGS: `${CONFIG.BASE_URL}/users/logs`,

  //School Profile
  UPDATE_SCHOOL_PROFILE: `${CONFIG.BASE_URL}/school-profile/update`,
  SCHOOL_PROFILE: `${CONFIG.BASE_URL}/school-profile/data`,
} as const;

export default ENDPOINT;
