import { JobReadDTO } from "@/dtos/Job/job";
import { ReportReadDTO } from "@/dtos/report";
import { ContactData } from "@/types/contacts";
import { apiService, ApiResponse } from "./apiService";
import { ENDPOINTS } from "@/config/endpoints";

class JobDetailsApiService {
  // Get job details by job number
  async getJobDetails(jobNumber: string): Promise<ApiResponse<JobReadDTO>> {
    try {
      console.log("Getting job details for job number:", jobNumber);
      const response = await apiService.get<JobReadDTO>(
        ENDPOINTS.JOBS.GET(jobNumber)
      );
      console.log("Job details response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  }

  // Get reports for a specific job
  async getJobReports(jobNumber: string): Promise<ApiResponse<ReportReadDTO[]>> {
    try {
      console.log("Getting reports for job number:", jobNumber);
      const response = await apiService.get<ReportReadDTO[]>(
        ENDPOINTS.REPORTS.JOB(jobNumber)
      );
      console.log("Job reports response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching job reports:", error);
      throw error;
    }
  }

  // Get recent reports for a job (limit to last 5)
  async getRecentJobReports(jobNumber: string, limit: number = 5): Promise<ApiResponse<ReportReadDTO[]>> {
    try {
      console.log(`Getting ${limit} recent reports for job number:`, jobNumber);
      const response = await apiService.get<ReportReadDTO[]>(
        ENDPOINTS.REPORTS.JOB(jobNumber)
      );
      
      if (response.data) {
        // Sort by submit date (most recent first) and limit results
        const sortedReports = response.data
          .sort((a, b) => {
            const dateA = new Date(a.submitDate || a.startDate || '');
            const dateB = new Date(b.submitDate || b.startDate || '');
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, limit);
        
        return {
          ...response,
          data: sortedReports
        };
      }
      
      return response;
    } catch (error) {
      console.error("Error fetching recent job reports:", error);
      throw error;
    }
  }

  // Assign a project manager to a job
  async assignProjectManager(jobNumber: string, contact: ContactData, notes?: string): Promise<ApiResponse<any>> {
    try {
      console.log(`Assigning project manager ${contact.id} to job ${jobNumber}`);
      const response = await apiService.post(
        ENDPOINTS.JOBS.ASSIGN_PROJECT_MANAGER(jobNumber),
        {
          personalInfoId: contact.id,
          notes: notes
        }
      );
      console.log("Project manager assignment response:", response);
      return response;
    } catch (error) {
      console.error("Error assigning project manager:", error);
      throw error;
    }
  }

  // Assign a site contact to a job
  async assignSiteContact(jobNumber: string, contact: ContactData, options?: {
    area?: string;
    company?: string;
    role?: string;
    isPrimary?: boolean;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log(`Assigning site contact ${contact.id} to job ${jobNumber}`);
      const response = await apiService.post(
        ENDPOINTS.JOBS.ASSIGN_SITE_CONTACT(jobNumber),
        {
          personalInfoId: contact.id,
          area: options?.area,
          company: options?.company,
          role: options?.role,
          isPrimary: options?.isPrimary || false,
          notes: options?.notes
        }
      );
      console.log("Site contact assignment response:", response);
      return response;
    } catch (error) {
      console.error("Error assigning site contact:", error);
      throw error;
    }
  }

  // Remove a project manager from a job
  async removeProjectManager(jobNumber: string, projectManagerId: number): Promise<ApiResponse<any>> {
    try {
      console.log(`Removing project manager ${projectManagerId} from job ${jobNumber}`);
      const response = await apiService.delete(
        ENDPOINTS.JOBS.REMOVE_PROJECT_MANAGER(jobNumber, projectManagerId)
      );
      console.log("Project manager removal response:", response);
      return response;
    } catch (error) {
      console.error("Error removing project manager:", error);
      throw error;
    }
  }

  // Remove a site contact from a job
  async removeSiteContact(jobNumber: string, siteContactId: number): Promise<ApiResponse<any>> {
    try {
      console.log(`Removing site contact ${siteContactId} from job ${jobNumber}`);
      const response = await apiService.delete(
        ENDPOINTS.JOBS.REMOVE_SITE_CONTACT(jobNumber, siteContactId)
      );
      console.log("Site contact removal response:", response);
      return response;
    } catch (error) {
      console.error("Error removing site contact:", error);
      throw error;
    }
  }
}

export const jobDetailsApiService = new JobDetailsApiService();
export default jobDetailsApiService;
