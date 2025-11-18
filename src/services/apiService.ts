import { JobCreateDTO, JobReadDTO, JobUpdateDTO } from "@/dtos/Job/job";
import { JobNoteReadDTO } from "@/dtos/Job/jobNote";
import { JobProjectManagerCreateDTO, JobProjectManagerReadDTO, JobProjectManagerUpdateDTO } from "@/dtos/Job/jobProjectManager";
import { JobSiteContactCreateDTO, JobSiteContactReadDTO, JobSiteContactUpdateDTO } from "@/dtos/Job/jobSiteContact";
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
        // Create error object with status code preserved
        const error: any = new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`,
        );
        error.status = response.status;
        error.responseText = errorText;
        throw error;
      }

      let data: T;

      if (response.status === 204) {
        data = undefined as T;
      } else {
        const responseText = await response.text();
        data = responseText ? (JSON.parse(responseText) as T) : (undefined as T);
      }

      return {
        data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error: any) {
      if (error instanceof Error) {
        console.error("API Service Error:", error);
        // Preserve status if it exists (from HTTP errors), otherwise default to 500
        const httpStatus = (error as any).status || 500;
        const responseText = (error as any).responseText;
        throw {
          message: error.message,
          status: httpStatus,
          details: error,
          responseText: responseText,
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

  async getJob(jobNumber: string): Promise<ApiResponse<JobReadDTO>> {
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

  async addJobNote(
    jobNumber: string,
    note: string,
  ): Promise<ApiResponse<JobNoteReadDTO>> {
    return this.post(ENDPOINTS.JOBS.NOTES(jobNumber), { note });
  }

  async deleteJobNote(
    jobNumber: string,
    noteId: number,
  ): Promise<ApiResponse<void>> {
    return this.delete(ENDPOINTS.JOBS.NOTE(jobNumber, noteId));
  }

  // Project Manager methods
  async createProjectManager(
    jobNumber: string,
    pmData: JobProjectManagerCreateDTO,
  ): Promise<ApiResponse<JobProjectManagerReadDTO>> {
    return this.post(ENDPOINTS.JOBS.PROJECT_MANAGER.CREATE(jobNumber), pmData);
  }

  async updateProjectManager(
    jobNumber: string,
    pmId: number,
    pmData: JobProjectManagerUpdateDTO,
  ): Promise<ApiResponse<JobProjectManagerReadDTO>> {
    return this.put(ENDPOINTS.JOBS.PROJECT_MANAGER.UPDATE(jobNumber, pmId), pmData);
  }

  async deleteProjectManager(
    jobNumber: string,
    pmId: number,
  ): Promise<ApiResponse<void>> {
    return this.delete(ENDPOINTS.JOBS.PROJECT_MANAGER.DELETE(jobNumber, pmId));
  }

  // Site Contact methods
  async createSiteContact(
    jobNumber: string,
    scData: JobSiteContactCreateDTO,
  ): Promise<ApiResponse<JobSiteContactReadDTO>> {
    return this.post(ENDPOINTS.JOBS.SITE_CONTACT.CREATE(jobNumber), scData);
  }

  async updateSiteContact(
    jobNumber: string,
    scId: number,
    scData: JobSiteContactUpdateDTO,
  ): Promise<ApiResponse<JobSiteContactReadDTO>> {
    return this.put(ENDPOINTS.JOBS.SITE_CONTACT.UPDATE(jobNumber, scId), scData);
  }

  async deleteSiteContact(
    jobNumber: string,
    scId: number,
  ): Promise<ApiResponse<void>> {
    return this.delete(ENDPOINTS.JOBS.SITE_CONTACT.DELETE(jobNumber, scId));
  }
}

class PeopleAPIService extends BaseApiService {
  async getPeople(): Promise<ApiResponse<any[]>> {
    return this.get(ENDPOINTS.PEOPLE.LIST);
  }

  async getPerson(id: number): Promise<ApiResponse<any>> {
    return this.get(ENDPOINTS.PEOPLE.GET(id));
  }

  async createEmployee(employeeData: any): Promise<ApiResponse<any>> {
    return this.post(ENDPOINTS.PEOPLE.CREATE_EMPLOYEE, employeeData);
  }

  async createContractor(contractorData: any): Promise<ApiResponse<any>> {
    return this.post(ENDPOINTS.PEOPLE.CREATE_CONTRACTOR, contractorData);
  }
}

// class ProctorsAPIService extends BaseApiService {
//   async getProctorsForJob(jobNumber: string): Promise<ApiResponse<any[]>> {
//     return this.get(ENDPOINTS.REPORTS.PROCTORS_FOR_JOB(jobNumber));
//   }
// }
// class RefactorMeAPIService extends BaseApiService {
//   // People methods (replaces clients and project managers)
//   async getPeople(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/people");
//   }

//   async getEmployees(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/test/employees");
//   }
//   async getEmployees(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/test/employees");
//   }

//   async getContractors(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/test/contractors");
//   }
//   async getContractors(): Promise<ApiResponse<any[]>> {
//     return this.get("/api/test/contractors");
//   }

//   // Report methods
//   async createReport(reportData: any): Promise<ApiResponse<any>> {
//     return this.post(ENDPOINTS.REPORTS.CREATE, reportData);
//   }

//   async getReportsByJob(jobNumber: string): Promise<ApiResponse<any[]>> {
//     return this.get(ENDPOINTS.REPORTS.JOB(jobNumber));
//   }

//   async getReport(reportId: number): Promise<ApiResponse<any>> {
//     return this.get(ENDPOINTS.REPORTS.GET(reportId));
//   }

//   // Create density test
//   async createDensityTest(
//     reportId: number,
//     densityTestData: any,
//   ): Promise<ApiResponse<any>> {
//     return this.post(ENDPOINTS.REPORTS.CREATE_DENSITY_TEST(reportId), densityTestData);
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
export const peopleAPIService = new PeopleAPIService();
export const testAPIService = new TestAPIService();

export type { ApiResponse, ApiError };
