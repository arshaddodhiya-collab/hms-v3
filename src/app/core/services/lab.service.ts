import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface LabTest {
  id: number;
  name: string;
  code: string;
  price: number;
}

export interface LabTestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface LabRequest {
  id: string | number;
  patientId: string | number;
  patientName: string;
  doctorName: string;
  testName: string;
  requestDate: Date;
  status:
    | 'Pending'
    | 'In Progress'
    | 'Completed'
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'COMPLETED';
  priority?: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  results?: LabTestResult[];
  technicianNotes?: string;
  completedDate?: Date;
  result?: string; // Legacy
}

@Injectable({
  providedIn: 'root',
})
export class LabService {
  private mockTests: LabTest[] = [
    { id: 1, name: 'Complete Blood Count', code: 'CBC', price: 50 },
    { id: 2, name: 'Lipid Profile', code: 'LIPID', price: 80 },
    { id: 3, name: 'Thyroid Function', code: 'TFT', price: 60 },
    { id: 4, name: 'Blood Sugar Fasting', code: 'FBS', price: 30 },
    { id: 5, name: 'Liver Function Test', code: 'LFT', price: 90 },
  ];

  private mockRequests: LabRequest[] = [
    {
      id: '101',
      patientId: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      testName: 'Complete Blood Count',
      requestDate: new Date(),
      status: 'Pending',
      priority: 'ROUTINE',
    },
    {
      id: '102',
      patientId: 2,
      patientName: 'Jane Smith',
      doctorName: 'Dr. House',
      testName: 'Lipid Profile',
      requestDate: new Date(),
      status: 'Completed',
      priority: 'URGENT',
      result: 'Total Cholesterol: 200 mg/dL',
      results: [
        {
          parameter: 'Cholesterol',
          value: '200',
          unit: 'mg/dL',
          referenceRange: '<200',
          isAbnormal: false,
        },
      ],
    },
  ];

  private requestsSubject = new BehaviorSubject<LabRequest[]>(
    this.mockRequests,
  );
  public requests$ = this.requestsSubject.asObservable();

  constructor() {}

  getTests(): Observable<LabTest[]> {
    return of(this.mockTests);
  }

  getPendingRequests(): Observable<LabRequest[]> {
    return of(
      this.requestsSubject.value.filter(
        (r) => r.status === 'Pending' || r.status === 'PENDING',
      ),
    );
  }

  getAllRequests(): Observable<LabRequest[]> {
    return this.requests$.pipe(delay(500));
  }

  getRequestById(id: string | number): LabRequest | undefined {
    // Loose equality check for string/number id mismatch
    return this.requestsSubject.value.find((r) => r.id == id);
  }

  createRequest(request: LabRequest): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        request.id = Math.floor(Math.random() * 10000).toString();
        request.status = 'Pending';
        request.requestDate = new Date();
        const current = this.requestsSubject.value;
        this.requestsSubject.next([...current, request]);
      }),
    );
  }

  addResult(
    requestId: string | number,
    results: LabTestResult[],
    notes?: string,
  ): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        const current = this.requestsSubject.value;
        const index = current.findIndex((r) => r.id == requestId);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = {
            ...updated[index],
            status: 'Completed',
            results: results,
            technicianNotes: notes,
            completedDate: new Date(),
          };
          this.requestsSubject.next(updated);
        }
      }),
    );
  }
}
