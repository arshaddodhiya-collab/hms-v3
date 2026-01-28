import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LabTestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  testName: string;
  requestDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  results?: LabTestResult[];
  technicianNotes?: string;
  completedDate?: Date;
}

const MOCK_LAB_REQUESTS: LabRequest[] = [
  {
    id: 'REQ-101',
    patientId: 'P-101',
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    testName: 'Complete Blood Count (CBC)',
    requestDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    status: 'PENDING',
    priority: 'ROUTINE',
  },
  {
    id: 'REQ-102',
    patientId: 'P-102',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Adams',
    testName: 'Lipid Profile',
    requestDate: new Date(),
    status: 'IN_PROGRESS',
    priority: 'URGENT',
  },
  {
    id: 'REQ-103',
    patientId: 'P-101',
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    testName: 'Thyroid Function Test',
    requestDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    status: 'COMPLETED',
    priority: 'ROUTINE',
    completedDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    results: [
      {
        parameter: 'TSH',
        value: '2.5',
        unit: 'mIU/L',
        referenceRange: '0.4 - 4.0',
        isAbnormal: false,
      },
      {
        parameter: 'T4',
        value: '1.2',
        unit: 'ng/dL',
        referenceRange: '0.8 - 1.8',
        isAbnormal: false,
      },
    ],
  },
];

@Injectable({
  providedIn: 'root', // Or 'any', but providedIn root is easiest for singleton mock
})
export class LabService {
  private requests$ = new BehaviorSubject<LabRequest[]>(MOCK_LAB_REQUESTS);

  constructor() {}

  getRequests(): Observable<LabRequest[]> {
    return this.requests$.asObservable();
  }

  getRequestById(id: string): LabRequest | undefined {
    return this.requests$.getValue().find((r) => r.id === id);
  }

  updateRequest(updatedRequest: LabRequest): void {
    const currentRequests = this.requests$.getValue();
    const index = currentRequests.findIndex((r) => r.id === updatedRequest.id);
    if (index !== -1) {
      currentRequests[index] = updatedRequest;
      this.requests$.next([...currentRequests]);
    }
  }

  addResult(requestId: string, results: LabTestResult[], notes?: string): void {
    const request = this.getRequestById(requestId);
    if (request) {
      request.results = results;
      request.technicianNotes = notes;
      request.status = 'COMPLETED';
      request.completedDate = new Date();
      this.updateRequest(request);
    }
  }
}
