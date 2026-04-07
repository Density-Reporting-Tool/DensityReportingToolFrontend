export interface ProctorTypeDTO {
  id: number;
  type: string;
}

export interface ProctorLabTestJobDTO {
  id: number;
  jobNumber: string;
}

export interface ProctorLabTestDTO {
  id: number;
  jobId: number;
  job?: ProctorLabTestJobDTO | null;
  materialType: string;
  importLocation: string;
  receiveDate: string;
  sieves: any[];
}

export interface ProctorBaseDTO {
  proctorID: string;
  proctorTestNumber: string;
  labTestId: number;
  sieveId: number | null;
  proctorTypeId: number;
  materialType: string;
  labLocation: string;
  dateSampled: string | null;
  dateTested: string | null;
  maxDensity: number | null;
  correctedDensity: number | null;
  optimumMoistureContent: number | null;
  specificGravity: number | null;
  oversizePercentage: number | null;
}

export interface ProctorReadDTO extends ProctorBaseDTO {
  id: number;
  proctorType: ProctorTypeDTO;
  labTest: ProctorLabTestDTO;
  sieve: any | null;
  additionalJobs: any[];
  densityTests: any[];
}

/**
 * For POST /api/proctor — exactly one of labTestId, jobId, or jobNumber is required.
 * If jobNumber or jobId is used, a new LabTest is created automatically.
 */
export interface ProctorCreateDTO {
  proctorID: string;
  proctorTestNumber: string;
  labTestId?: number | null;
  jobId?: number | null;
  jobNumber?: string | null;
  sieveId: number | null;
  proctorTypeId: number;
  materialType: string;
  labLocation: string;
  dateSampled: string | null;
  dateTested: string | null;
  maxDensity: number | null;
  correctedDensity: number | null;
  optimumMoistureContent: number | null;
  specificGravity: number | null;
  oversizePercentage: number | null;
}

/** For PUT /api/proctor/{id} — labTestId is still required for updates. */
export interface ProctorUpdateDTO extends ProctorBaseDTO {
  id: number;
}
