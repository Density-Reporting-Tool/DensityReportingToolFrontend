import { BaseApiService } from "./baseApiService";
import { PagedResult } from "@/types/api";
import {
  ProctorReadDTO,
  ProctorCreateDTO,
  ProctorUpdateDTO,
} from "@/dtos/Proctor/proctor";

export class ProctorApiService extends BaseApiService {
  constructor() {
    super("proctor");
  }

  /**
   * GET /api/proctor?pageNumber=x&pageSize=y
   */
  async getAll(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<PagedResult<ProctorReadDTO>> {
    return this.get<PagedResult<ProctorReadDTO>>("", {
      params: { pageNumber, pageSize },
    });
  }

  /**
   * GET /api/proctor/{id}
   */
  async getById(id: number): Promise<ProctorReadDTO> {
    return this.get<ProctorReadDTO>(`/${id}`);
  }

  /**
   * POST /api/proctor
   */
  async create(dto: ProctorCreateDTO): Promise<ProctorReadDTO> {
    return this.post<ProctorReadDTO>("", dto);
  }

  /**
   * PUT /api/proctor/{id}
   */
  async update(id: number, dto: ProctorUpdateDTO): Promise<ProctorReadDTO> {
    return this.put<ProctorReadDTO>(`/${id}`, dto);
  }

  /**
   * GET /api/proctor/search/{jobNumber}?limit=x
   */
  async searchByJobNumber(
    jobNumber: string,
    limit: number = 10,
  ): Promise<ProctorReadDTO[]> {
    return this.get<ProctorReadDTO[]>(`/search/${jobNumber}`, {
      params: { limit },
    });
  }

  /**
   * GET /api/proctor/job/{jobNumber}
   */
  async getByJobNumber(jobNumber: string): Promise<ProctorReadDTO[]> {
    return this.get<ProctorReadDTO[]>(`/job/${jobNumber}`);
  }

  /**
   * GET /api/proctor/job-id/{jobId}
   */
  async getByJobId(jobId: number): Promise<ProctorReadDTO[]> {
    return this.get<ProctorReadDTO[]>(`/job-id/${jobId}`);
  }
}

export const proctorApi = new ProctorApiService();
