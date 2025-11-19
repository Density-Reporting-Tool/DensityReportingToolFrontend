import { PersonData } from "./People/personalInfo";
export interface ReportBaseDTO {
  jobId: number;
  employeeId: number;
  reviewerId: number;

  reportNumber: number;
  startDate?: string; // ISO 8601 string
  submitDate?: string; // ISO 8601 string
  distributeDate?: string; // ISO 8601 string

  distributionListId?: number;
}

export interface ReportCreateDTO extends ReportBaseDTO {}
export interface ReportUpdateDTO extends ReportBaseDTO {}

export interface ReportReadDTO extends ReportBaseDTO {
  id: number;

  employeeName: string;
  reviewerName: string;

  //   photos?: ReportPhotoDTO[];
  //   memos?: ReportMemoDTO[];
  //   densityTests?: DensityTestDTO[];
}

export interface ReportListDTO {
  id: number;
  jobId: number;
  reportNumber: number;
  startDate?: string;
  submitDate?: string;
  distributeDate?: string;
  employee: PersonData;
  reviewer: PersonData;
  densityTestsCount: 0;
  photosCount: 0;
  memosCount: 1;
  distributionListId: null;
}

export interface ReportDetailDTO {
  id: number;
  jobId: number;
  job: JobData;
  reportNumber: number;
  startDate?: string;
  submitDate?: string;
  distributeDate?: string;
  employee: PersonData;
  reviewer: PersonData;
  densityTests: [];
  photos: [];
  memos: [];
  distributionListId: null;
}

export interface JobData {
  id: number;
  jobNumber: string;
  clientName: string;
  projectName: string;
}
