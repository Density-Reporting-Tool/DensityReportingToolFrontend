import { JobReadDTO } from "../Job/job";

// --- Nested types (backend GeoPacificEmployeeReadDto, RoleReadDto) ---

export interface RoleReadDTO {
  id: number;
  roleTitle: string;
}

export interface GeoPacificEmployeeReadDTO {
  id: number;
  personalInfoId: number;
  roleId: number;
  role: RoleReadDTO;
}

export interface ScheduleJobReadDTO {
    id: number
    jobId: number
    geoPacificEmployeeId: number
    startDateTime: string 
    endDateTime: string 
    description: string | null
    location: string | null
    status: string | null //e.g. "Scheduled", "Cancelled"
    createdById: number | null
    createdBy: GeoPacificEmployeeReadDTO | null
    createdDate: string 
    job: JobReadDTO 
    geoPacificEmployee: GeoPacificEmployeeReadDTO
}

export interface ScheduleJobCreateDTO {
    jobId: number
    geoPacificEmployeeId: number
    startDateTime: string 
    endDateTime: string 
    description?: string | null
    location?: string | null
    status?: string | null //e.g. "Scheduled", "Cancelled"
    createdById?: number | null
    createdBy?: GeoPacificEmployeeReadDTO | null
    createdDate?: string | null
}

export interface ScheduleJobUpdateDTO {
    id: number
    jobId: number
    geoPacificEmployeeId: number
    startDateTime: string 
    endDateTime: string 
    description?: string | null
    location?: string | null
    status?: string | null //e.g. "Scheduled", "Cancelled"
    createdById?: number | null
    createdBy?: GeoPacificEmployeeReadDTO | null
    createdDate?: string | null
}