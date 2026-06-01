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

  // Request timeout in milliseconds
  TIMEOUT: import.meta.env.PROD ? 60000 : 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to get appropriate timeout for current environment
export const getRequestTimeout = (): number => API_CONFIG.TIMEOUT;
