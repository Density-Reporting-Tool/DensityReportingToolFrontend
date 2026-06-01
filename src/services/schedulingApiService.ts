import { ENDPOINTS } from "@/config/endpoints";
import { ApiService, ApiResponse } from "./apiService";
import { ScheduleJobReadDTO, ScheduleJobCreateDTO, ScheduleJobUpdateDTO } from "@/dtos/Scheduling/scheduleJob";

class SchedulingApiService extends ApiService {
  async getEventsInRange(
    startUtcIso: string,
    endUtcIso: string
  ): Promise<ApiResponse<ScheduleJobReadDTO[]>> {
    const url = `${ENDPOINTS.SCHEDULING.EVENTS}?start=${encodeURIComponent(startUtcIso)}&end=${encodeURIComponent(endUtcIso)}`;
    return this.get<ScheduleJobReadDTO[]>(url);
  }

  async getScheduleJobByEventId(
    id: number
  ): Promise<ApiResponse<ScheduleJobReadDTO>> {
    return this.get<ScheduleJobReadDTO>(ENDPOINTS.SCHEDULING.EVENT(id));
  }

  async createScheduleJob(
    scheduleJob: ScheduleJobCreateDTO
  ): Promise<ApiResponse<ScheduleJobReadDTO>> {
    return this.post<ScheduleJobReadDTO>(ENDPOINTS.SCHEDULING.EVENTS, scheduleJob);
  }

  async updateScheduleJob(
    id: number,
    scheduleJob: ScheduleJobUpdateDTO
  ): Promise<ApiResponse<ScheduleJobReadDTO>> {
    return this.put<ScheduleJobReadDTO>(ENDPOINTS.SCHEDULING.EVENT(id), scheduleJob);
  }

  async deleteScheduleJob(
    id: number
  ): Promise<ApiResponse<ScheduleJobReadDTO>> {
    return this.delete<ScheduleJobReadDTO>(ENDPOINTS.SCHEDULING.EVENT(id));
  }
}

export const schedulingApiService = new SchedulingApiService();