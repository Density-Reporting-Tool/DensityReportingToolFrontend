import { JobCreateDTO, JobReadDTO, JobUpdateDTO } from "@/dtos/Job/job";
import { buildApiUrl, getAuthHeaders, getRequestTimeout } from "../config/api";
import { ENDPOINTS } from "@/config/endpoints";

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

class BaseApiService {
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
}

class JobsAPIService extends BaseApiService {
  // Job-specific methods
  async createJob(jobData: JobCreateDTO): Promise<ApiResponse<any>> {
    return this.post(ENDPOINTS.JOBS.CREATE, jobData);
  }

  async getJob(jobNumber: string): Promise<ApiResponse<any>> {
    return this.get(ENDPOINTS.JOBS.GET(jobNumber));
  }

  async updateJob(job: JobUpdateDTO): Promise<ApiResponse<any>> {
    return this.put(ENDPOINTS.JOBS.UPDATE(`${job.id}`), job);
  }

  async deleteJob(jobNumber: string): Promise<ApiResponse<any>> {
    return this.delete(ENDPOINTS.JOBS.DELETE(jobNumber));
  }

  async getAllJobs(): Promise<ApiResponse<JobReadDTO[]>> {
    return this.get(ENDPOINTS.JOBS.LIST);
  }

  async searchJobsByJobNumber(
    jobNumber: string,
  ): Promise<ApiResponse<JobReadDTO[]>> {
    return this.get(ENDPOINTS.JOBS.SEARCH(jobNumber));
  }
}

// class RefactorMeAPIService extends BaseApiService {
//   // People methods (replaces clients and project managers)
//   async getPeople(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/people");
//   }

//   async getEmployees(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/test/employees");
//   }

//   async getContractors(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/test/contractors");
//   }

//   // Report methods
//   async createReport(reportData: any): Promise<ApiResponse<any>> {
//     return this.post(ENDPOINTS.REPORTS.CREATE, reportData);
//   }

//   async getReportsByJob(jobId: number): Promise<ApiResponse<any[]>> {
//     return this.get(`/api/reports/job/${jobId}`);
//   }

//   async getReport(reportId: number): Promise<ApiResponse<any>> {
//     return this.get(`/api/reports/${reportId}`);
//   }

//   async getProctorsForJob(jobId: number): Promise<ApiResponse<any[]>> {
//     return this.get(`/api/reports/proctors/job/${jobId}`);
//   }

//   // Create density test
//   async createDensityTest(
//     reportId: number,
//     densityTestData: any,
//   ): Promise<ApiResponse<any>> {
//     return this.post(`/api/reports/${reportId}/density-test`, densityTestData);
//   }
// }
class TestAPIService extends BaseApiService {
  // Health check
  async getHealth(): Promise<ApiResponse<any>> {
    return this.get("/api/test/health");
  }
}

export const apiService = new BaseApiService();
export const jobsAPIService = new JobsAPIService();
export const testAPIService = new TestAPIService();
export type { ApiResponse, ApiError };
