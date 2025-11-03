import { 
  ContactData, 
  ContactCreateResponse,
  ContactSearchResult,
  ContactValidationResult,
  GeoPacificEmployeeContactData,
  GeoPacificAppUserData,
} from "@/types/contacts";
import { apiService, ApiResponse } from "./apiService";
import { ENDPOINTS } from "@/config/endpoints";

// Main ContactApiService class following the same pattern as ProctorApiService
class ContactApiService {
  private readonly baseEndpoint = ENDPOINTS.PEOPLE.LIST;

  // Get all contacts
  async getAllContacts(): Promise<ApiResponse<ContactSearchResult[]>> {
    try {
      console.log("Getting all contacts");
      return await apiService.get<ContactSearchResult[]>(this.baseEndpoint);
    } catch (error) {
      console.error("Error fetching all contacts", error);
      throw error;
    }
  }

  // Get contact by ID
  async getContactById(contactId: number): Promise<ApiResponse<ContactData>> {
    try {
      console.log("Getting contact details for contact id:", contactId);
      const response = await apiService.get<ContactData>(`${this.baseEndpoint}/${contactId}`);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error fetching contact details", error);
      throw error;
    }
  }

  // Create a new contact (PersonalInfo)
  async createContact(contactData: ContactData): Promise<ApiResponse<ContactCreateResponse>> {
    try {
      console.log("Creating contact with data:", contactData);
      return await apiService.post<ContactCreateResponse>(this.baseEndpoint, contactData);
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  // Create a new GeoPacific employee contact (without app user privileges)
  async createGeoPacificEmployeeContact(
    employeeData: GeoPacificEmployeeContactData
  ): Promise<ApiResponse<ContactCreateResponse>> {
    try {
      console.log("Creating GeoPacific employee contact with data:", employeeData);
      return await apiService.post<ContactCreateResponse>(
        `${this.baseEndpoint}/geopacific-employee`,
        employeeData
      );
    } catch (error) {
      console.error("Error creating GeoPacific employee contact:", error);
      throw error;
    }
  }

  // Create a new GeoPacific app user
  async createGeoPacificAppUser(
    appUserData: GeoPacificAppUserData
  ): Promise<ApiResponse<ContactCreateResponse>> {
    try {
      console.log("Creating GeoPacific app user with data:", appUserData);
      return await apiService.post<ContactCreateResponse>(
        `${this.baseEndpoint}/geopacific-app-user`,
        appUserData
      );
    } catch (error) {
      console.error("Error creating GeoPacific app user:", error);
      throw error;
    }
  }

  // Update an existing contact
  async updateContact(
    contactId: number,
    contactData: ContactData
  ): Promise<ApiResponse<ContactData>> {
    try {
      console.log("Updating contact with data:", contactData);
      return await apiService.put<ContactData>(
        `${this.baseEndpoint}/${contactId}`,
        contactData
      );
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  }

  // Delete a contact
  async deleteContact(contactId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log("Deleting contact with id:", contactId);
      return await apiService.delete<{ message: string }>(`${this.baseEndpoint}/${contactId}`);
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }

  // Search contacts
  async searchContacts(
    searchTerm: string,
    limit: number = 10
  ): Promise<ApiResponse<ContactSearchResult[]>> {
    try {
      console.log("Searching contacts with term:", searchTerm);
      return await apiService.get<ContactSearchResult[]>(
        `${this.baseEndpoint}/search?searchTerm=${encodeURIComponent(searchTerm)}&limit=${limit}`
      );
    } catch (error) {
      console.error("Error searching contacts:", error);
      throw error;
    }
  }

  // Validate contact data before submission
  validateContactData(data: ContactData): ContactValidationResult {
    const errors: string[] = [];

    if (!data.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!data.lastName?.trim()) {
      errors.push("Last name is required");
    }

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Email format is invalid");
    }

    if (!data.phoneNumber?.trim()) {
      errors.push("Phone number is required");
    }

    // Additional validation for GeoPacific employees
    if (data.personType === "GeoPacific Employee" && !data.role?.trim()) {
      errors.push("Role is required for GeoPacific employees");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate GeoPacific employee contact data
  validateGeoPacificEmployeeContactData(data: GeoPacificEmployeeContactData): ContactValidationResult {
    const errors: string[] = [];

    if (!data.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!data.lastName?.trim()) {
      errors.push("Last name is required");
    }

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Email format is invalid");
    }

    if (!data.phoneNumber?.trim()) {
      errors.push("Phone number is required");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate GeoPacific app user data
  validateGeoPacificAppUserData(data: GeoPacificAppUserData): ContactValidationResult {
    const errors: string[] = [];

    if (!data.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!data.lastName?.trim()) {
      errors.push("Last name is required");
    }

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Email format is invalid");
    }

    if (!data.phoneNumber?.trim()) {
      errors.push("Phone number is required");
    }

    if (!data.roleId || data.roleId <= 0) {
      errors.push("Role is required");
    }

    if (!data.password?.trim()) {
      errors.push("Password is required");
    } else if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to format contact for display
  formatContactForDisplay(contact: ContactData): string {
    const roleText = contact.role ? ` (${contact.role})` : '';
    return `${contact.firstName} ${contact.lastName}${roleText}`;
  }

  // Helper method to get contact initials
  getContactInitials(contact: ContactData): string {
    const firstInitial = contact.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = contact.lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }
}

// Export singleton instance
export const contactApiService = new ContactApiService();
