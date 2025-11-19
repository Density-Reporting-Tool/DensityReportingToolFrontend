import { JobCreateDTO, JobUpdateDTO, JobReadDTO } from "@/types/dtos/Job/job";
import { BaseApiService } from "./baseApiService";
import { ENDPOINTS } from "@/config/endpoints";
import { ApiResponse } from "@/types/api";

class JobsAPIService extends BaseApiService {
  async getAllJobs(): Promise<ApiResponse<JobReadDTO[]>> {
    return this.get(ENDPOINTS.JOBS.LIST);
  }

  async createJob(jobData: JobCreateDTO): Promise<ApiResponse<any>> {
    return this.post(ENDPOINTS.JOBS.CREATE, jobData);
  }

  async getJobByJobNumber(jobNumber: string): Promise<ApiResponse<any>> {
    return this.get(ENDPOINTS.JOBS.GET(jobNumber));
  }

  async updateJobByJobId(job: JobUpdateDTO): Promise<ApiResponse<any>> {
    return this.put(ENDPOINTS.JOBS.UPDATE(`${job.id}`), job);
  }

  async deleteJobByJobNumber(jobNumber: string): Promise<ApiResponse<any>> {
    return this.delete(ENDPOINTS.JOBS.DELETE(jobNumber));
  }

  async searchJobsByJobNumber(
    jobNumber: string,
  ): Promise<ApiResponse<JobReadDTO[]>> {
    return this.get(ENDPOINTS.JOBS.SEARCH(jobNumber));
  }
}

export const jobsApiService = new JobsAPIService();
