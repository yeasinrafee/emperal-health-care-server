import { BloodGroup, Gender, MaritalStatus } from '@prisma/client';

export type TPatientFilterRequest = {
  name: string | undefined;
  email: string | undefined;
  contactNumber: string | undefined;
  searchTerm: string | undefined;
};

export type TUpdatePatientResponse = {
  name: string;
  contactNumber: string;
  address: string;
  patientHealthData: TPatientHealthData;
  medicalReport: TMedicalReport;
};

export type TPatientHealthData = {
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height: string;
  weight: string;
  smokingStatus?: boolean;
  dietaryPreferences?: string;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string;
  immunizationStatus?: string;
  hasPastSurgery?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: MaritalStatus;
};

export type TMedicalReport = {
  reportName: string;
  reportLink: string;
};
