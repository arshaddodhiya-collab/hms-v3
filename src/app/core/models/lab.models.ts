export enum LabRequestStatus {
  ORDERED = 'ORDERED',
  SAMPLED = 'SAMPLED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface LabResult {
  id: number;
  parameterName: string;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
}

export interface LabRequest {
  id: number;
  encounterId: number;
  patientId: number;
  patientName: string;
  labTestId?: number;
  testName: string;
  testCode?: string;
  status: LabRequestStatus;
  technicianNotes?: string;
  createdAt: string;
  referenceRange?: string;
  results?: LabResult[];
  parameters?: {
    id: number;
    parameterName: string;
    unit: string;
    referenceRange: string;
  }[];
}

export interface LabTest {
  id: number;
  name: string;
  code: string;
  price: number;
  referenceRange?: string;
  active: boolean;
}

export interface CreateLabRequest {
  encounterId: number;
  patientId: number;
  labTestId: number;
  notes?: string;
}

export interface AddLabResultRequest {
  parameterName: string;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
}
