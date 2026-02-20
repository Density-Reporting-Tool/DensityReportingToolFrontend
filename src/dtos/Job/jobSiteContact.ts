import { PersonalInfoReadDTO } from "../People/personalInfo";

export interface JobSiteContactBaseDTO {
  area: string | null;
  company: string | null;
  role: string | null;
  isPrimary: boolean;
  notes: string | null;
  isActive: boolean;
}

export interface JobSiteContactReadDTO extends JobSiteContactBaseDTO {
  id: number;
  jobId: number;
  personalInfoId: number;
  personalInfo: PersonalInfoReadDTO;
  createdDate: string; // ISO 8601 string
  lastModifiedDate: string | null;
}

export interface JobSiteContactCreateDTO extends JobSiteContactBaseDTO {
  personalInfoId: number;
}

export interface JobSiteContactUpdateDTO extends JobSiteContactBaseDTO {
  id: number;
}
