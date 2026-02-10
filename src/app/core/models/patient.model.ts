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

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  TRIAGE_PENDING = 'TRIAGE_PENDING',
  CONSULTATION_PENDING = 'CONSULTATION_PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Visit {
  // OPD Visit
  id: number;
  patientId: number;
  patientName: string;
  appointmentTime: Date;
  status: VisitStatus;
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
