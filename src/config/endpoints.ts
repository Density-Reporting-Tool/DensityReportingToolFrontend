export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    REGISTER: "/api/auth/register",
  },
  REPORTS: {
    LIST: "/api/reports",
    CREATE: "/api/reports",
    GET: (id: number) => `/api/reports/${id}`,
    UPDATE: (id: number) => `/api/reports/${id}`,
    DELETE: (id: number) => `/api/reports/${id}`,
    SEARCH: (jobNumber: string) => `/api/reports/search?jobNumber=${jobNumber}`,
    JOB: (jobNumber: string) => `/api/reports/job/${jobNumber}`,
    PROCTORS_FOR_JOB: (jobId: number) => `/api/reports/proctors/job/${jobId}`,
    CREATE_DENSITY_TEST: (reportId: number) =>
      `/api/reports/${reportId}/density-test`,
  },
  DENSITY: {
    CALCULATE: "/api/density/calculate",
    ANALYZE: "/api/density/analyze",
    EXPORT: "/api/density/export",
  },
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE: "/api/users/profile",
    PREFERENCES: "/api/users/preferences",
  },
  JOBS: {
    LIST: "/api/jobs",
    CREATE: "/api/jobs",
    GET: (id: string) => `/api/jobs/${id}`,
    UPDATE: (id: string) => `/api/jobs/${id}`,
    DELETE: (id: string) => `/api/jobs/${id}`,
    SEARCH: (jobNumber: string) => `/api/jobs/search?jobNumber=${jobNumber}`,
  },
  PROCTOR: {
    LIST: "/api/proctor",
    CREATE: "/api/proctor",
    GET: (id: number) => `/api/proctor/${id}`,
    UPDATE: (id: number) => `/api/proctor/${id}`,
    SEARCH: (jobNumber: string) => `/api/proctor/search/${jobNumber}`,
    JOB: (jobNumber: string) => `/api/proctor/job/${jobNumber}`,
    JOB_ID: (jobId: number) => `/api/proctor/job-id/${jobId}`,
  },
  HEALTH: {
    HEALTH: "/health",
    HOME: "/home",
    API_HEALTH: "/api/health",
  },
  SCHEDULING: {
    EVENTS: "/api/scheduling/events",
    EVENT: (id: number | string) => `/api/scheduling/events/${id}`,
  },
  /** People / employees and contractors. Matches backend /api/People */
  PEOPLE: {
    LIST: "/api/People",
    SEARCH: (query: string) => `/api/People/search/${encodeURIComponent(query)}`,
    EMPLOYEE: (id: number | string) => `/api/People/employees/${id}`,
    EMPLOYEE_CREATE: "/api/People/employees",
    CONTRACTOR: (id: number | string) => `/api/People/contractors/${id}`,
    CONTRACTOR_CREATE: "/api/People/contractors",
  },
  ROLES: {
    LIST: "/api/roles",
  },
};
  