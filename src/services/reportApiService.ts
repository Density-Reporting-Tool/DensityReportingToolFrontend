import { ReportReadDTO, ReportCreateDTO } from "@/dtos/report";
import { apiService, ApiResponse } from "./apiService";
import { ENDPOINTS } from "@/config/endpoints";

class ReportApiService {
  // Create a draft report
  async createDraftReport(
    jobId: string,
    employeeId: number,
  ): Promise<ApiResponse<ReportReadDTO>> {
    try {
      console.log("Creating draft report for job:", jobId);
      const draftData: ReportCreateDTO = {
        jobId: parseInt(jobId),
        employeeId: employeeId,
        startDate: new Date().toISOString(),
      };

      const response = await apiService.post<ReportReadDTO>(
        ENDPOINTS.REPORTS.CREATE,
        draftData,
      );
      console.log("Draft report created:", response);
      return response;
    } catch (error) {
      console.error("Error creating draft report:", error);
      throw error;
    }
  }

  // Get report by ID
  async getReport(reportId: string): Promise<ApiResponse<ReportReadDTO>> {
    try {
      console.log("Getting report:", reportId);
      const response = await apiService.get<ReportReadDTO>(
        ENDPOINTS.REPORTS.GET(parseInt(reportId)),
      );
      console.log("Report response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  }

  // Update report
  async updateReport(
    reportId: number,
    reportData: Partial<ReportCreateDTO>,
  ): Promise<ApiResponse<ReportReadDTO>> {
    try {
      console.log("Updating report:", reportId);
      const response = await apiService.put<ReportReadDTO>(
        ENDPOINTS.REPORTS.UPDATE(reportId),
        reportData,
      );
      console.log("Report updated:", response);
      return response;
    } catch (error) {
      console.error("Error updating report:", error);
      throw error;
    }
  }
}

export const reportApiService = new ReportApiService();
export default reportApiService;
