import { VitalsResponse } from './vitals.model';

export interface EncounterResponse {
  id: number;
  appointmentId?: number;
  admissionId?: number;
  patientId: number;
  patientName: string;
  patientGender?: string;
  patientDob?: string;
  doctorId: number;
  doctorName: string;
  status: 'TRIAGE' | 'IN_PROGRESS' | 'COMPLETED';
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
  startedAt: string;
  visitedAt?: string;

  vitals?: VitalsResponse; // Current/Latest Vitals
  vitalsHistory?: VitalsResponse[];
  rounds?: RoundResponse[];
}

export interface RoundResponse {
  id: number;
  encounterId: number;
  doctorId: number;
  doctorName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface EncounterCreateRequest {
  appointmentId: number;
  patientId: number;
  doctorId: number;
}

export interface EncounterUpdateRequest {
  chiefComplaint?: string;
  diagnosis?: string;
  notes?: string;
}
