export interface ReportBaseDTO {
  jobId: number;
  employeeId: number;
  reviewerId: number;

  reportNumber: number;
  startDate?: string;
  submitDate?: string;
  distributeDate?: string;

  distributionListId?: number;
}

export interface ReportCreateDTO extends ReportBaseDTO {}
export interface ReportUpdateDTO extends ReportBaseDTO {}

export interface ReportReadDTO extends ReportBaseDTO {
  id: number;

  employeeName: string;
  reviewerName: string;
}

// ---- Shapes returned by ReportsController ----

export interface EmployeeInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface JobInfo {
  id: number;
  jobNumber: string;
  clientName: string;
  projectName: string;
}

export interface DensityTestInfo {
  id: number;
  testNumber: number;
  testArea?: string;
  location?: string;
  elevationReference?: string;
  elevationValue: number;
  elevationUnit?: string;
  compactionSpecification: number;
  compactionSpecificationUnit?: string;
  densityValue: number;
  moistureValue: number;
  createdDate: string;
  compactionPercentage: number;
  passed: boolean;
}

export interface PhotoInfo {
  id: number;
  code?: string;
  url?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracyMeters?: number;
}

export interface MemoInfo {
  id: number;
  purpose?: string;
  commentsAndObservations?: string;
  conclusion?: string;
  createdDate: string;
  updatedDate?: string;
}

export interface ReportDetailResponse {
  id: number;
  jobId: number;
  job: JobInfo;
  reportNumber: number;
  startDate?: string;
  submitDate?: string;
  distributeDate?: string;
  employee: EmployeeInfo;
  reviewer?: EmployeeInfo;
  densityTests: DensityTestInfo[];
  photos: PhotoInfo[];
  memos: MemoInfo[];
  distributionListId?: number;
}

export interface ReportListByJobResponse {
  id: number;
  jobId: number;
  job: { id: number; jobNumber: string; clientName: string; projectName: string };
  reportNumber: number;
  startDate?: string;
  submitDate?: string;
  distributeDate?: string;
  employee: EmployeeInfo;
  reviewer: EmployeeInfo;
  densityTestsCount: number;
  photosCount: number;
  memosCount: number;
  distributionListId?: number;
}

// ---- Report creation ----

export interface CreateReportRequest {
  jobId: number;
  employeeId: number; // TODO[AUTH]: Replace with authenticated user ID
  reviewerId?: number;
  startDate?: string;
}

// ---- Memo update (PATCH /api/reports/{reportId}/memo) ----

export interface UpdateMemoRequest {
  purpose?: string;
  commentsAndObservations?: string;
  conclusion?: string;
}

// ---- Density test creation ----

export interface CreateDensityTestRequest {
  proctorId: number;
  testArea?: string;
  location?: string;
  elevationReference?: string;
  elevationValue?: number;
  elevationUnit?: string;
  correctedOversizePercentage?: number;
  probeDepth?: number;
  probeDepthUnit?: string;
  compactionSpecification?: number;
  compactionSpecificationUnit?: string;
  densityValue?: number;
  moistureValue?: number;
}

export interface DensityTestCreateResponse {
  id: number;
  message: string;
}
