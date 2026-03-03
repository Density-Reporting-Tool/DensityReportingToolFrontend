import { ENDPOINTS } from "@/config/endpoints";
import { ApiService, ApiResponse } from "./apiService";
import { ScheduleJobReadDTO, ScheduleJobCreateDTO, ScheduleJobUpdateDTO } from "@/dtos/Scheduling/scheduleJob";
import { BackendApiResponse } from "@/dtos/common/backendApiResponse";

class SchedulingApiService extends ApiService {
  async getEventsInRange(
    startUtcIso: string,
    endUtcIso: string
  ): Promise<ApiResponse<BackendApiResponse<ScheduleJobReadDTO[]>>> {
    const url = `${ENDPOINTS.SCHEDULING.EVENTS}?start=${encodeURIComponent(startUtcIso)}&end=${encodeURIComponent(endUtcIso)}`;
    return this.get<BackendApiResponse<ScheduleJobReadDTO[]>>(url);
  }

  async getScheduleJobByEventId(
    id: number
  ): Promise<ApiResponse<BackendApiResponse<ScheduleJobReadDTO>>> {
    return this.get<BackendApiResponse<ScheduleJobReadDTO>>(ENDPOINTS.SCHEDULING.EVENT(id));
  }

  async createScheduleJob(
    scheduleJob: ScheduleJobCreateDTO
  ): Promise<ApiResponse<BackendApiResponse<ScheduleJobReadDTO>>> {
    return this.post<BackendApiResponse<ScheduleJobReadDTO>>(ENDPOINTS.SCHEDULING.EVENTS, scheduleJob);
  }

  async updateScheduleJob(
    id: number,
    scheduleJob: ScheduleJobUpdateDTO
  ): Promise<ApiResponse<BackendApiResponse<ScheduleJobReadDTO>>> {
    return this.put<BackendApiResponse<ScheduleJobReadDTO>>(ENDPOINTS.SCHEDULING.EVENT(id), scheduleJob);
  }

  async deleteScheduleJob(
    id: number
  ): Promise<ApiResponse<BackendApiResponse<ScheduleJobReadDTO>>> {
    return this.delete<BackendApiResponse<ScheduleJobReadDTO>>(ENDPOINTS.SCHEDULING.EVENT(id));
  }
}

export const schedulingApiService = new SchedulingApiService();