export interface ReportBaseDTO {
  jobId: number;
  employeeId: number;
  reviewerId?: number;

  reportNumber: number;
  startDate?: string; // ISO 8601 string
  submitDate?: string; // ISO 8601 string
  distributeDate?: string; // ISO 8601 string

  distributionListId?: number;
}

export interface ReportCreateDTO {
  jobId: number;
  employeeId: number;
  reviewerId?: number;
  startDate?: string;
  submitDate?: string;
  distributeDate?: string;
  distributionListId?: number;
  memo?: {
    purpose?: string;
    commentsAndObservations?: string;
    conclusion?: string;
  };
}

export interface ReportUpdateDTO extends ReportBaseDTO {}

export interface ReportReadDTO extends ReportBaseDTO {
  id: number;

  employeeName: string;
  reviewerName: string;

  //   photos?: ReportPhotoDTO[];
  //   memos?: ReportMemoDTO[];
  //   densityTests?: DensityTestDTO[];
}
