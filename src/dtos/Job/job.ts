import { ReportReadDTO } from "../report";
import { JobNoteReadDTO } from "./jobNote";
import { JobProjectManagerReadDTO } from "./jobProjectManager";
import { JobSiteContactReadDTO } from "./jobSiteContact";

export interface JobBaseDTO {
  jobNumber: string;
  clientName: string;
  projectName: string;
  siteAddress: string;
  startDate?: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string
}

export interface JobCreateDTO extends JobBaseDTO {
  jobNotes?: JobNoteReadDTO[];
}

export interface JobUpdateDTO extends JobBaseDTO {
  id: number;
}

export interface JobReadDTO extends JobBaseDTO {
  id: number;
  jobNotes?: JobNoteReadDTO[];
  reports?: ReportReadDTO[];
  projectManagers?: JobProjectManagerReadDTO[];
  siteContacts?: JobSiteContactReadDTO[];
}
