export interface AppointmentRequest {
  patientId: number;
  doctorId: number;
  startDateTime: string; // ISO 8601
  endDateTime: string; // ISO 8601
  type: string; // CONSULTATION, FOLLOW_UP, etc.
  reason: string;
  status?: string;
}

export interface AppointmentResponse {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  startDateTime: string;
  endDateTime: string;
  status: string; // SCHEDULED, CHECKED_IN, CANCELLED, COMPLETED
  type: string;
  reason: string;
}
