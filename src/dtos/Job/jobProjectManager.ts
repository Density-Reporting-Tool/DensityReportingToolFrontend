import { PersonalInfoReadDTO } from "../People/personalInfo";

export interface JobProjectManagerBaseDTO {
  startDate: string; // ISO 8601 string
  endDate: string | null;
  notes: string | null;
  isPrimary: boolean;
  isActive: boolean;
  geoPacificEmployeeId: number | null;
}

export interface JobProjectManagerReadDTO extends JobProjectManagerBaseDTO {
  id: number;
  jobId: number;
  personalInfoId: number;
  personalInfo: PersonalInfoReadDTO;
  createdDate: string;
  lastModifiedDate: string | null;
}

export interface JobProjectManagerCreateDTO extends JobProjectManagerBaseDTO {
  personalInfoId: number;
}

export interface JobProjectManagerUpdateDTO extends JobProjectManagerBaseDTO {
  id: number;
}
