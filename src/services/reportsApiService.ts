import { apiService, ApiResponse } from "./apiService";
import { ENDPOINTS } from "@/config/endpoints";
import {
  CreateReportRequest,
  ReportDetailResponse,
  ReportListByJobResponse,
  CreateDensityTestRequest,
  DensityTestCreateResponse,
  MemoInfo,
  UpdateMemoRequest,
} from "@/dtos/report";

class ReportsApiService {
  async getAllReports(): Promise<ApiResponse<ReportListByJobResponse[]>> {
    return apiService.get<ReportListByJobResponse[]>(ENDPOINTS.REPORTS.LIST);
  }

  async createReport(data: CreateReportRequest): Promise<ApiResponse<{ id: number; reportNumber: number }>> {
    return apiService.post(ENDPOINTS.REPORTS.CREATE, data);
  }

  async getReport(reportId: number): Promise<ApiResponse<ReportDetailResponse>> {
    return apiService.get<ReportDetailResponse>(ENDPOINTS.REPORTS.GET(reportId));
  }

  async getReportsByJob(jobNumber: string): Promise<ApiResponse<ReportListByJobResponse[]>> {
    return apiService.get<ReportListByJobResponse[]>(ENDPOINTS.REPORTS.JOB(jobNumber));
  }

  async updateMemo(reportId: number, data: UpdateMemoRequest): Promise<ApiResponse<MemoInfo>> {
    return apiService.patch<MemoInfo>(ENDPOINTS.REPORTS.UPDATE_MEMO(reportId), data);
  }

  async createDensityTest(
    reportId: number,
    data: CreateDensityTestRequest,
  ): Promise<ApiResponse<DensityTestCreateResponse>> {
    return apiService.post<DensityTestCreateResponse>(
      ENDPOINTS.REPORTS.CREATE_DENSITY_TEST(reportId),
      data,
    );
  }
}

export const reportsApiService = new ReportsApiService();
