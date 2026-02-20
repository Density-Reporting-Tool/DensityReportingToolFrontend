import { PersonalInfoReadDTO } from "../People/personalInfo";
// These will be needed as you build out the related modules:
// import { DistributionListReadDTO } from "../jobs/distributionList";
// import { ReportPhotoReadDTO } from "./reportPhoto";
// import { ReportMemoReadDTO } from "./reportMemo";
// import { DensityTestReadDTO } from "../density/densityTest";

export interface ReportBaseDTO {
  jobId: number;
  employeeId: number;
  reviewerId: number | null;
  reportNumber: number;
  startDate: string | null;
  submitDate: string | null;
  distributeDate: string | null;
  distributionListId: number | null;
}

export interface ReportReadDTO extends ReportBaseDTO {
  id: number;
  employee: PersonalInfoReadDTO;
  reviewer: PersonalInfoReadDTO | null;
  distributionList: any | null; // Placeholder for DistributionListReadDTO

  photos: any[]; // Placeholder for ReportPhotoReadDTO[]
  memos: any[]; // Placeholder for ReportMemoReadDTO[]
  densityTests: any[]; // Placeholder for DensityTestReadDTO[]
}

export interface ReportCreateDTO extends ReportBaseDTO {
  // Matches C# ReportCreateDto
}

export interface ReportUpdateDTO extends ReportBaseDTO {
  id: number;
}
