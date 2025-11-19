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
    // SEARCH: (jobNumber: string) => `/api/reports/search?jobNumber=${jobNumber}`,
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
    GET: (jobNumber: string) => `/api/jobs/${jobNumber}`,
    UPDATE: (id: string) => `/api/jobs/${id}`,
    DELETE: (id: string) => `/api/jobs/${id}`,
    SEARCH: (jobNumber: string) => `/api/jobs/search?jobNumber=${jobNumber}`,
  },
  PROCTOR: {
    LIST: "/api/proctors",
    CREATE: "/api/proctors",
    GET: (id: string) => `/api/proctors/${id}`,
    UPDATE: (id: string) => `/api/proctors/${id}`,
    DELETE: (id: string) => `/api/proctors/${id}`,
    SEARCH: (jobNumber: string) =>
      `/api/proctors/search?jobNumber=${jobNumber}`,
    LAB_ADMIN: {
      LIST: "/api/proctors/lab-admin",
      CREATE: "/api/proctors/lab-admin",
      GET: (id: number) => `/api/proctors/${id}`,
      UPDATE: (id: number) => `/api/proctors/lab-admin/${id}`,
    },
    FIELD_TECH: {
      DENSITY_REQUIREMENTS: (id: number) =>
        `/api/proctors/field-tech/${id}/density-requirements`,
    },
    JOB: (jobNumber: string) => `/api/proctors/job/${jobNumber}`,
  },
  HEALTH: {
    HEALTH: "/health",
    HOME: "/home",
    API_HEALTH: "/api/health",
  },
};
