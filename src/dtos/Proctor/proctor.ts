export interface ProctorTypeDTO {
  id: number;
  type: string;
}

export interface ProctorLabTestDTO {
  id: number;
  jobId: number;
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

export interface ProctorCreateDTO extends ProctorBaseDTO {}

export interface ProctorUpdateDTO extends ProctorBaseDTO {
  id: number;
}
