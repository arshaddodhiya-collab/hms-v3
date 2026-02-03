export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address?: string; // Added fields relevant for hospital records
  email?: string;
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
  id: number;
  ward: string;
  number: string;
  isOccupied: boolean;
  type: string; // e.g., 'ICU', 'General'
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
