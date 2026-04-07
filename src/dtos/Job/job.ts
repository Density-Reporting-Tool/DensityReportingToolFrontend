import { ReportReadDTO } from "../Reports/report";
import { JobNoteReadDTO } from "./jobNote";
import { JobProjectManagerReadDTO } from "./jobProjectManager";
import { JobSiteContactReadDTO } from "./jobSiteContact";
// import { SitePlanReadDTO } from "./sitePlan";
// import { LabTestReadDTO } from "../lab";
// import { ProctorAdditionalJobReadDTO } from "./proctorAdditionalJob";
// import { DistributionListReadDTO } from "./distributionList";

export interface JobBaseDTO {
  jobNumber: string;
  clientName: string;
  projectName: string;
  siteAddress: string;
  startDate: string | null; // C# DateTime? maps to string (ISO) or null
  endDate: string | null;
}

export interface JobReadDTO extends JobBaseDTO {
  id: number;

  // Mapping the ICollection initializations from C#
  reports: ReportReadDTO[];
  sitePlans: any[]; // Placeholder until SitePlan DTO is ready
  labTests: any[]; // Placeholder until LabTest DTO is ready
  proctorAdditionalJobs: any[];
  jobNotes: JobNoteReadDTO[];
  distributionLists: any[];
  projectManagers: JobProjectManagerReadDTO[];
  siteContacts: JobSiteContactReadDTO[];
}

export interface JobCreateDTO extends JobBaseDTO {
  // Matches your C# JobCreateDto (Empty, inheriting base)
}

export interface JobUpdateDTO extends JobBaseDTO {
  id: number;
}
