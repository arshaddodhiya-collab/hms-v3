export interface VitalsResponse {
  id: number;
  encounterId: number;
  temperature?: number;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordedAt: string;
  recordedBy: number; // User Id
}

export interface VitalsRequest {
  temperature?: number;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  spo2?: number;
  weight?: number;
  height?: number;
}
