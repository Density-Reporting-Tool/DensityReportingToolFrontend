import { PersonalInfoReadDTO } from "../People/personalInfo";

export interface JobSiteContactBaseDTO {
  jobId: number;
  personalInfoId: number;

  area?: string;
  company?: string;
  role?: string;
  isPrimary: boolean;
  notes?: string;
  isActive: boolean;
}

export interface JobSiteContactCreateDTO extends JobSiteContactBaseDTO {}
export interface JobSiteContactUpdateDTO extends JobSiteContactBaseDTO {}

export interface JobSiteContactReadDTO extends JobSiteContactBaseDTO {
  id: number;
  contactName?: string; // Full name from PersonalInfo
  createdDate: string; // ISO 8601 string
  lastModifiedDate?: string; // ISO 8601 string, optional

  personalInfo?: PersonalInfoReadDTO;
}
