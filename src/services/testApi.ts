import { ApiResponse } from "@/types/api";
import { BaseApiService } from "./baseApiService";

class TestAPIService extends BaseApiService {
  // Health check
  async getHealth(): Promise<ApiResponse<any>> {
    return this.get("/api/test/health");
  }
}

export const testAPIService = new TestAPIService();
