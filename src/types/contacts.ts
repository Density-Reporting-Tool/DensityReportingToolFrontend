// Contact data interface - represents all the form fields for contact management
export interface ContactData {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
  personType?: "Contact" | "GeoPacific Employee";
  role?: string;
  isAppUser?: boolean;
}

// API response interfaces
export interface ContactCreateResponse {
  id: number;
  message: string;
  contact: ContactData;
}

export interface ContactListResponse {
  contacts: ContactData[];
  total: number;
}

// GeoPacific Employee Contact interfaces
export interface GeoPacificEmployeeContactData {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId?: number;
  role?: string;
  isAppUser: false;
}

// GeoPacific App User interfaces
export interface GeoPacificAppUserData {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  role?: string;
  password: string;
  isAppUser: true;
}

// Union type for all contact types
export type AnyContactData = ContactData | GeoPacificEmployeeContactData | GeoPacificAppUserData;

// Contact form validation result
export interface ContactValidationResult {
  isValid: boolean;
  errors: string[];
}

// Contact search result
export interface ContactSearchResult {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
  personType: "Contact" | "GeoPacific Employee";
  role?: string;
}

// Contact selection for autocomplete/selection components
export interface ContactOption {
  id: number;
  label: string;
  value: ContactData;
  personType: "Contact" | "GeoPacific Employee";
  role?: string;
}
