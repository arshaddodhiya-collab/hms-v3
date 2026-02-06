import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Patient } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  // Mock Database
  private mockPatients: Patient[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      gender: 'Male',
      contact: '1234567890',
      email: 'john@example.com',
      address: '123 Main St',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      gender: 'Female',
      contact: '0987654321',
      email: 'jane@example.com',
      address: '456 Oak Ave',
    },
    {
      id: 3,
      name: 'Robert Brown',
      age: 55,
      gender: 'Male',
      contact: '5551234567',
      address: '789 Pine Rd',
    },
  ];

  private patientsSubject = new BehaviorSubject<Patient[]>(this.mockPatients);
  public patients$ = this.patientsSubject.asObservable();

  constructor() { }

  getPatients(): Observable<Patient[]> {
    return this.patients$.pipe(delay(500)); // Simulate network latency
  }

  getPatientById(id: number): Observable<Patient | undefined> {
    return this.patients$.pipe(
      map((patients) => patients.find((p) => p.id === id)),
    );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return of(patient).pipe(
      delay(500),
      tap((p) => {
        p.id = Math.floor(Math.random() * 10000); // Generate ID
        const current = this.patientsSubject.value;
        this.patientsSubject.next([...current, p]);
      }),
    );
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return of(patient).pipe(
      delay(500),
      tap((p) => {
        const current = this.patientsSubject.value;
        const index = current.findIndex((x) => x.id === p.id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = p;
          this.patientsSubject.next(updated);
        }
      }),
    );
  }

  deletePatient(id: number): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        const current = this.patientsSubject.value;
        this.patientsSubject.next(current.filter((p) => p.id !== id));
      }),
    );
  }
}
