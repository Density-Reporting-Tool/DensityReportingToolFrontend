// Debug environment variables
console.log('Environment Variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV
})

// API configuration for backend integration
export const API_CONFIG = {
  // Base URL for API calls - can be overridden by environment variables
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
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
  
  // Request timeout in milliseconds (longer for Render's cold starts)
  TIMEOUT: import.meta.env.PROD ? 60000 : 30000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  },
  
  // Render-specific settings
  RENDER: {
    // Handle Render's cold start delays
    COLD_START_DELAY: 5000,
    // Retry on 502/503 errors (common during cold starts)
    RETRY_ON_STATUS: [502, 503, 504]
  }
}

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`
  console.log(`Building API URL: ${fullUrl} (BASE_URL: ${API_CONFIG.BASE_URL})`)
  return fullUrl
}

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function to check if we're connecting to Render
export const isRenderBackend = (): boolean => {
  return API_CONFIG.BASE_URL.includes('onrender.com')
}

// Helper function to get appropriate timeout for current environment
export const getRequestTimeout = (): number => {
  if (isRenderBackend()) {
    return API_CONFIG.TIMEOUT
  }
  return 30000
} 