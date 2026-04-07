import { JobReadDTO } from "../Job/job";
import { PersonalInfoReadDTO } from "../People/personalInfo";

// --- Nested types (backend GeoPacificEmployeeReadDto, RoleReadDto) ---

export interface RoleReadDTO {
  id: number;
  roleTitle: string;
}


export interface ScheduleJobReadDTO {
    id: number
    jobId: number
    personalInfoId: number
    personalInfo: PersonalInfoReadDTO
    startDateTime: string 
    endDateTime: string 
    description: string | null
    status: string | null //e.g. "Scheduled", "Cancelled"
    createdById: number | null
    createdBy: PersonalInfoReadDTO | null
    createdDate: string 
    job: JobReadDTO 
}

export interface ScheduleJobCreateDTO {
    jobId: number
    personalInfoId: number
    startDateTime: string 
    endDateTime: string 
    description?: string | null
    status?: string | null //e.g. "Scheduled", "Cancelled"
    createdById?: number | null
    createdBy?: PersonalInfoReadDTO | null
    createdDate?: string | null
}

export interface ScheduleJobUpdateDTO {
    id: number
    jobId: number
    personalInfoId: number
    startDateTime: string 
    endDateTime: string 
    description?: string | null
    status?: string | null //e.g. "Scheduled", "Cancelled"
    createdById?: number | null
    createdBy?: PersonalInfoReadDTO | null
    createdDate?: string | null
}