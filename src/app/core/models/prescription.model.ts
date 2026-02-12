export interface PrescriptionItem {
  id?: number;
  medicineName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

export interface PrescriptionResponse {
  id: number;
  encounterId: number;
  note?: string;
  status: 'DRAFT' | 'ISSUED';
  issuedAt?: string;
  items: PrescriptionItem[];
}

export interface PrescriptionRequest {
  note?: string;
  items: PrescriptionItem[];
}
