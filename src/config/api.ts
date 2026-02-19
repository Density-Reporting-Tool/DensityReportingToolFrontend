import { ENDPOINTS } from "./endpoints";

const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const resolvedBaseUrl = envBaseUrl || (import.meta.env.DEV ? "http://localhost:5013" : "");

if (!resolvedBaseUrl && import.meta.env.PROD) {
  throw new Error(
    "Missing VITE_API_BASE_URL for production build/runtime configuration.",
  );
}

const normalizedBaseUrl = resolvedBaseUrl.replace(/\/+$/, "");

// API configuration for backend integration
export const API_CONFIG = {
  // Base URL for API calls. Production must provide VITE_API_BASE_URL.
  BASE_URL: normalizedBaseUrl,

  // API endpoints
  ENDPOINTS: ENDPOINTS,

  // Request timeout in milliseconds (longer for Render's cold starts)
  TIMEOUT: import.meta.env.PROD ? 60000 : 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
  },

  // Render-specific settings
  RENDER: {
    // Handle Render's cold start delays
    COLD_START_DELAY: 5000,
    // Retry on 502/503 errors (common during cold starts)
    RETRY_ON_STATUS: [502, 503, 504],
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
  console.log(
    `Building API URL: ${fullUrl} (BASE_URL: ${API_CONFIG.BASE_URL})`,
  );
  return fullUrl;
};

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to check if we're connecting to Render
export const isRenderBackend = (): boolean => {
  return (
    API_CONFIG.BASE_URL.includes("onrender.com") ||
    API_CONFIG.BASE_URL.includes("ondigitalocean.app")
  );
};

// Helper function to get appropriate timeout for current environment
export const getRequestTimeout = (): number => {
  if (isRenderBackend()) {
    return API_CONFIG.TIMEOUT;
  }
  return 30000;
};
