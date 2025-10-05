// Proctor data interface - represents all the form fields
export interface ProctorData {
  id: number | null;
  jobNumber: string;
  proctorTestNumber: string;
  materialType: string;
  dateSampled: string;
  proctorType: "SPDD" | "MPDD";
  maxDryDensity: string;
  correctedDensity: string;
  labLocation: string;
  proctorId: string;
  dateTested: string;
  oversizePercentage: number;
  optimumMoisture: number;
  specificGravity: string;
  image_src: string;
}

// API response interfaces
export interface ProctorCreateResponse {
  id: string;
  message: string;
  proctor: ProctorData;
}

export interface ProctorListResponse {
  proctors: ProctorData[];
  total: number;
}
