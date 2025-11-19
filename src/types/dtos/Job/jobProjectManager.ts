import { PersonalInfoReadDTO } from "../People/personalInfo";
import { JobReadDTO } from "./job";

export interface JobProjectManagerBaseDTO {
  jobId: number;
  personalInfoId: number;

  startDate: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string, optional

  notes?: string;
  isActive: boolean;
}

export interface JobProjectManagerCreateDTO extends JobProjectManagerBaseDTO {}
export interface JobProjectManagerUpdateDTO extends JobProjectManagerBaseDTO {}

export interface JobProjectManagerReadDTO extends JobProjectManagerBaseDTO {
  id: number;
  fullName: string;
  createdDate: string; // ISO 8601 string
  lastModifiedDate?: string; // ISO 8601 string, optional

  personalInfo?: PersonalInfoReadDTO;
  job?: JobReadDTO;
}
