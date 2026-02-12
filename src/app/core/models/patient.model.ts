export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  name?: string; // transient logic to combine first and last
  dob: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  contact: string;
  email?: string;
  address?: string;
  allergies?: string;
  avatar?: string;
  lastVisit?: string; // Placeholder for now
  medicalHistory?: MedicalHistory[];
}

export interface MedicalHistory {
  id: number;
  conditionName: string; // Backend calls it conditionName
  diagnosedDate: string;
  status: 'ONGOING' | 'HEALED' | 'CHRONIC';
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum EncounterStatus {
  TRIAGE = 'TRIAGE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Visit {
  // OPD Visit
  id: number;
  patientId: number;
  patientName: string;
  appointmentTime: Date;
  status: AppointmentStatus;
  doctorName?: string;
  department?: string;
  triageData?: any; // To be defined
  diagnosis?: string;
}

export enum AdmissionStatus {
  ADMITTED = 'ADMITTED',
  DISCHARGED = 'DISCHARGED',
  TRANSFERRED = 'TRANSFERRED',
}

export interface Bed {
  id: number | string;
  ward: string;
  number: string;
  isOccupied: boolean;
  type: string; // e.g., 'ICU', 'General'
  patientName?: string;
}

export interface Admission {
  // IPD Admission
  id: number;
  patientId: number;
  patientName: string;
  admissionDate: Date;
  dischargeDate?: Date;
  status: AdmissionStatus;
  ward: string;
  bedNumber: string;
  doctorName: string;
  diagnosis?: string;
}
