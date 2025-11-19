export interface PersonalInfoBaseDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company?: string;
}

export interface PersonalInfoCreateDTO extends PersonalInfoBaseDTO {}
export interface PersonalInfoUpdateDTO extends PersonalInfoBaseDTO {}

export interface PersonalInfoReadDTO extends PersonalInfoBaseDTO {
  id: number;
}
