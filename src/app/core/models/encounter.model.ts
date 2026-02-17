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
  completedAt?: string;
  vitals?: Vitals;
  rounds?: RoundResponse[];
  vitalsHistory?: Vitals[];
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

export interface Vitals {
  id: number;
  encounterId: number;
  temperature: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  spo2: number;
  weight: number;
  height: number;
  bmi: number;
  recordedAt: string;
  recordedBy?: string;
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
