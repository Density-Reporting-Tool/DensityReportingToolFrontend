import { ProctorData, ProctorCreateResponse } from "@/types/proctors";
import { apiService, ApiResponse } from "../apiService";
import { ENDPOINTS } from "../../config/endpoints";

// Main ProctorApiService class
class ProctorApiService {
  async getAllProctors(jobNumber: string): Promise<ApiResponse<ProctorData[]>> {
    try {
      console.log("Getting all proctors for the job id: ", jobNumber);
      return await apiService.get<ProctorData[]>(
        `/api/proctors/job/${jobNumber}`,
      );
    } catch (error) {
      console.error("Error fetching proctors for a job id", error);

      throw error;
    }
  }

  async getProctorById(proctorId: string): Promise<ApiResponse<ProctorData>> {
    try {
      console.log("Getting proctor details for proctor id: ", proctorId);
      const response = await apiService.get<ProctorData>(
        `/api/proctors/${proctorId}`,
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error fetching proctors for a job id", error);
      throw error;
    }
  }

  // Create a new proctor
  async createProctor(
    proctorData: ProctorData,
  ): Promise<ApiResponse<ProctorCreateResponse>> {
    try {
      console.log("Creating proctor with data:", proctorData);
      return await apiService.post<ProctorCreateResponse>(
        ENDPOINTS.PROCTOR.CREATE,
        proctorData,
      );
    } catch (error) {
      console.error("Error creating proctor:", error);
      throw error;
    }
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
