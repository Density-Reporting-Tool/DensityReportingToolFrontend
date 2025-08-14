// API configuration for backend integration
export const API_CONFIG = {
  // Base URL for API calls - can be overridden by environment variables
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      REGISTER: '/api/auth/register'
    },
    REPORTS: {
      LIST: '/api/reports',
      CREATE: '/api/reports',
      GET: (id: string) => `/api/reports/${id}`,
      UPDATE: (id: string) => `/api/reports/${id}`,
      DELETE: (id: string) => `/api/reports/${id}`
    },
    DENSITY: {
      CALCULATE: '/api/density/calculate',
      ANALYZE: '/api/density/analyze',
      EXPORT: '/api/density/export'
    },
    USERS: {
      PROFILE: '/api/users/profile',
      UPDATE: '/api/users/profile',
      PREFERENCES: '/api/users/preferences'
    }
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  }
}

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
} 