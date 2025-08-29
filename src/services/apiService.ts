import { buildApiUrl, getAuthHeaders, getRequestTimeout } from "../config/api";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = buildApiUrl(endpoint);
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(getRequestTimeout()),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("API Service Error:", error);
        throw {
          message: error.message,
          status: 500,
          details: error,
        } as ApiError;
      }
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Job-specific methods
  async createJob(jobData: any): Promise<ApiResponse<any>> {
    return this.post("/jobs", jobData);
  }

  async getClients(): Promise<ApiResponse<string[]>> {
    return this.get("/clients");
  }

  async getProjectManagers(): Promise<ApiResponse<string[]>> {
    return this.get("/project-managers");
  }

  async createClient(clientData: any): Promise<ApiResponse<any>> {
    return this.post("/clients", clientData);
  }

  async createProjectManager(managerData: any): Promise<ApiResponse<any>> {
    return this.post("/project-managers", managerData);
  }
}

export const apiService = new ApiService();
export type { ApiResponse, ApiError };
