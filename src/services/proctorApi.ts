import { ProctorData } from "@/types/proctors";
import { ApiResponse } from "@/types/api";
import { BaseApiService, baseApiService } from "./baseApiService";
import { ENDPOINTS } from "@/config/endpoints";

class ProctorApiService extends BaseApiService {
  async getAllProctdors(): Promise<ApiResponse<ProctorData[]>> {
    return baseApiService.get(ENDPOINTS.PROCTOR.LIST);
  }

  async createProctor(
    proctorData: ProctorData,
  ): Promise<ApiResponse<ProctorData>> {
    return baseApiService.post(ENDPOINTS.PROCTOR.CREATE, proctorData);
  }

  async getProctorById(proctorId: string): Promise<ApiResponse<ProctorData>> {
    return baseApiService.get(ENDPOINTS.PROCTOR.GET(proctorId));
  }

  async getProctorsByJobNumber(
    jobNumber: string,
  ): Promise<ApiResponse<ProctorData[]>> {
    return baseApiService.get(ENDPOINTS.PROCTOR.JOB(jobNumber));
  }

  async updateProctorById(
    proctorId: string,
    proctorData: ProctorData,
  ): Promise<ApiResponse<ProctorData>> {
    return baseApiService.put(ENDPOINTS.PROCTOR.UPDATE(proctorId), proctorData);
  }

  async deleteProctorById(
    proctorId: string,
  ): Promise<ApiResponse<ProctorData>> {
    return baseApiService.delete(ENDPOINTS.PROCTOR.DELETE(proctorId));
  }

  // Validate proctor data before submission
  validateProctorData(data: ProctorData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.jobNumber?.trim()) {
      errors.push("Job number is required");
    }

    if (!data.proctorTestNumber?.trim()) {
      errors.push("Proctor test number is required");
    }

    if (!data.materialType?.trim()) {
      errors.push("Material type is required");
    }

    if (!data.dateSampled) {
      errors.push("Date sampled is required");
    }

    if (!data.proctorType) {
      errors.push("Proctor type is required");
    }

    if (!data.maxDryDensity?.trim()) {
      errors.push("Max dry density is required");
    }

    if (!data.correctedDensity?.trim()) {
      errors.push("Corrected density is required");
    }

    if (!data.labLocation?.trim()) {
      errors.push("Lab location is required");
    }

    if (!data.proctorId?.trim()) {
      errors.push("Proctor ID is required");
    }

    if (!data.dateTested) {
      errors.push("Date tested is required");
    }

    if (data.oversizePercentage < 0 || data.oversizePercentage > 100) {
      errors.push("Oversize percentage must be between 0 and 100");
    }

    if (data.optimumMoisture < 0 || data.optimumMoisture > 100) {
      errors.push("Optimum moisture must be between 0 and 100");
    }

    // Specific gravity is optional - no validation needed

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export the service instance
export const proctorApiService = new ProctorApiService();
