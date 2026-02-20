import { BaseApiService } from "./baseApiService";
import { PagedResult } from "@/types/api";
import { JobReadDTO, JobCreateDTO, JobUpdateDTO } from "@/dtos/Job/job";

export class JobsApiService extends BaseApiService {
  constructor() {
    super("jobs");
  }

  /**
   * GET /api/jobs?pageNumber=x&pageSize=y
   */
  async getAll(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<PagedResult<JobReadDTO>> {
    return this.get<PagedResult<JobReadDTO>>("", {
      params: { pageNumber, pageSize },
    });
  }

  /**
   * GET /api/jobs/{jobNumber}
   */
  async getByNumber(jobNumber: string): Promise<JobReadDTO> {
    return this.get<JobReadDTO>(`/${jobNumber}`);
  }

  /**
   * POST /api/jobs
   */
  async create(dto: JobCreateDTO): Promise<JobReadDTO> {
    return this.post<JobReadDTO>("", dto);
  }

  /**
   * PUT /api/jobs/{jobId}
   */
  async update(jobId: number, dto: JobUpdateDTO): Promise<JobReadDTO> {
    return this.put<JobReadDTO>(`/${jobId}`, dto);
  }

  /**
   * GET /api/jobs/search/{jobNumber}?limit=x
   */
  async search(jobNumber: string, limit: number = 10): Promise<JobReadDTO[]> {
    return this.get<JobReadDTO[]>(`/search/${jobNumber}`, {
      params: { limit },
    });
  }
}

// Export a singleton instance
export const jobsApi = new JobsApiService();
