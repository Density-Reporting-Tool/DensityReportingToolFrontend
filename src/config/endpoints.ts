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
    GET: (id: string) => `/api/reports/${id}`,
    UPDATE: (id: string) => `/api/reports/${id}`,
    DELETE: (id: string) => `/api/reports/${id}`,
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
    LIST: "/api/jobs/",
    CREATE: "/api/jobs/",
    GET: (id: string) => `/api/jobs/${id}/`,
    UPDATE: (id: string) => `/api/jobs/${id}/`,
    DELETE: (id: string) => `/api/jobs/${id}/`,
  },
  PROCTOR: {
    LIST: `/api/proctors/`,
    CREATE: "/api/proctors/create/",
    GET: (id: string) => `/api/proctors/${id}/`,
    UPDATE: (id: string) => `/api/proctors/${id}/update/`,
    DELETE: (id: string) => `/api/proctors/${id}/delete/`,
  },
  HEALTH: {
    HEALTH: "/health",
    HOME: "/home",
    API_HEALTH: "/api/health"
  }
};
