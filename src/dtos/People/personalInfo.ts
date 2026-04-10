export type PersonType = "GeoPacific Employee" | "Contact";

/** Simple contact info embedded in jobs, reports, and scheduling DTOs */
export interface PersonalInfoReadDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
}

/** Shape returned by GET /api/people (paged list) */
export interface PersonReadDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string | null;
  personType: PersonType;
  role: string | null;
}

/** Shape returned by GET /api/people/employees/{id} */
export interface EmployeeReadDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  roleTitle: string;
  personType: "GeoPacific Employee";
}

/** Shape returned by GET /api/people/contractors/{id} */
export interface ContractorReadDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  personType: null;
}

/** POST /api/people/employees */
export interface EmployeeCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  password: string;
}

/** PUT /api/people/employees/{id} */
export interface EmployeeUpdateDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  password?: string | null;
}

/** POST /api/people/contractors */
export interface ContractorCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
}

/** PUT /api/people/contractors/{id} */
export interface ContractorUpdateDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
}

export interface RoleDTO {
  id: number;
  roleTitle: string;
}
