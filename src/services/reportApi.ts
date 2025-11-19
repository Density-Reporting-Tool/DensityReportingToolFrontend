import { ReportData } from "@/types/reports";
import { ENDPOINTS } from "../config/endpoints";
import { ApiResponse } from "@/types/api";
import { BaseApiService } from "./baseApiService";
import { ReportDetailDTO, ReportListDTO } from "@/types/dtos/report";

class ReportApiService extends BaseApiService {
  async getAllReports(): Promise<ApiResponse<ReportListDTO[]>> {
    return this.get(ENDPOINTS.REPORTS.LIST);
  }

  // async createReport(reportData: ReportData): Promise<ApiResponse<ReportData>> {
  //   return this.post(ENDPOINTS.REPORTS.CREATE, reportData);
  // }

  async getReportById(reportId: number): Promise<ApiResponse<ReportDetailDTO>> {
    return this.get(ENDPOINTS.REPORTS.GET(reportId));
  }

  async getReportsByJobNumber(
    jobNumber: string,
  ): Promise<ApiResponse<ReportListDTO[]>> {
    return this.get(ENDPOINTS.REPORTS.JOB(jobNumber));
  }

  // async updateReportById(
  //   reportData: ReportData,
  // ): Promise<ApiResponse<ReportData>> {
  //   return this.put(ENDPOINTS.REPORTS.UPDATE(reportData.id), reportData);
  // }

  // async deleteReportById(reportId: number): Promise<ApiResponse<ReportData>> {
  //   return this.delete(ENDPOINTS.REPORTS.DELETE(reportId));
  // }

  // Create density test
  async createDensityTest(
    reportId: number,
    densityTestData: any, // TODO: Add DensityTestData type
  ): Promise<ApiResponse<ReportData>> {
    return this.post(
      ENDPOINTS.REPORTS.CREATE_DENSITY_TEST(reportId),
      densityTestData,
    );
  }
}

// Export the service instance
export const reportApiService = new ReportApiService();
