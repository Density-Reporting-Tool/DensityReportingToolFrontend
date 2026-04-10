import { ApiService, ApiResponse } from "@/services/apiService";
import { BackendApiResponse } from "@/dtos/common/backendApiResponse";
import { ENDPOINTS } from "@/config/endpoints";
import {
  PersonReadDTO,
  EmployeeReadDTO,
  ContractorReadDTO,
  EmployeeCreateDTO,
  EmployeeUpdateDTO,
  ContractorCreateDTO,
  ContractorUpdateDTO,
  RoleDTO,
} from "@/dtos/People/personalInfo";

/** Extracts a list from various response envelope shapes the backend may return. */
function unwrapPersonList(raw: unknown): PersonReadDTO[] {
  if (Array.isArray(raw)) return raw as PersonReadDTO[];
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as PersonReadDTO[];
    if (
      o.data &&
      typeof o.data === "object" &&
      Array.isArray((o.data as Record<string, unknown>).items)
    )
      return (o.data as { items: PersonReadDTO[] }).items;
    if (Array.isArray(o.items)) return o.items as PersonReadDTO[];
  }
  return [];
}

export class PersonApiService extends ApiService {
  /** GET /api/People?pageNumber=x&pageSize=y */
  async getAll(pageNumber = 1, pageSize = 100): Promise<PersonReadDTO[]> {
    const url = `${ENDPOINTS.PEOPLE.LIST}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const res = await this.get<unknown>(url);
    return unwrapPersonList(res.data);
  }

  /** GET /api/People/employees/{id} */
  async getEmployee(
    id: number,
  ): Promise<ApiResponse<BackendApiResponse<EmployeeReadDTO>>> {
    return this.get<BackendApiResponse<EmployeeReadDTO>>(
      ENDPOINTS.PEOPLE.EMPLOYEE(id),
    );
  }

  /** GET /api/People/contractors/{id} */
  async getContractor(
    id: number,
  ): Promise<ApiResponse<BackendApiResponse<ContractorReadDTO>>> {
    return this.get<BackendApiResponse<ContractorReadDTO>>(
      ENDPOINTS.PEOPLE.CONTRACTOR(id),
    );
  }

  /** POST /api/People/employees */
  async createEmployee(
    dto: EmployeeCreateDTO,
  ): Promise<ApiResponse<BackendApiResponse<EmployeeReadDTO>>> {
    return this.post<BackendApiResponse<EmployeeReadDTO>>(
      ENDPOINTS.PEOPLE.EMPLOYEE_CREATE,
      dto,
    );
  }

  /** POST /api/People/contractors */
  async createContractor(
    dto: ContractorCreateDTO,
  ): Promise<ApiResponse<BackendApiResponse<ContractorReadDTO>>> {
    return this.post<BackendApiResponse<ContractorReadDTO>>(
      ENDPOINTS.PEOPLE.CONTRACTOR_CREATE,
      dto,
    );
  }

  /** PUT /api/People/employees/{id} */
  async updateEmployee(
    id: number,
    dto: EmployeeUpdateDTO,
  ): Promise<ApiResponse<BackendApiResponse<EmployeeReadDTO>>> {
    return this.put<BackendApiResponse<EmployeeReadDTO>>(
      ENDPOINTS.PEOPLE.EMPLOYEE(id),
      dto,
    );
  }

  /** PUT /api/People/contractors/{id} */
  async updateContractor(
    id: number,
    dto: ContractorUpdateDTO,
  ): Promise<ApiResponse<BackendApiResponse<ContractorReadDTO>>> {
    return this.put<BackendApiResponse<ContractorReadDTO>>(
      ENDPOINTS.PEOPLE.CONTRACTOR(id),
      dto,
    );
  }

  /** GET /api/roles — pre-seeded lookup; returns [] on failure */
  async getRoles(): Promise<RoleDTO[]> {
    try {
      const res = await this.get<BackendApiResponse<RoleDTO[]>>(
        ENDPOINTS.ROLES.LIST,
      );
      return res.data?.success ? (res.data.data ?? []) : [];
    } catch {
      return [];
    }
  }
}

export const personApi = new PersonApiService();
