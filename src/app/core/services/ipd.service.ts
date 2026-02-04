import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Admission, AdmissionStatus, Bed } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class IpdService {
  private mockAdmissions: Admission[] = [
    {
      id: 501,
      patientId: 1,
      patientName: 'John Doe',
      admissionDate: new Date('2023-10-20'),
      ward: 'General Ward',
      bedNumber: 'G101',
      doctorName: 'Dr. Smith',
      status: AdmissionStatus.ADMITTED,
      diagnosis: 'Viral Fever',
    },
  ];

  private mockBeds: Bed[] = [
    {
      id: 'G101',
      ward: 'General',
      number: '101',
      isOccupied: true,
      patientName: 'John Doe',
      type: 'General',
    },
    {
      id: 'G102',
      ward: 'General',
      number: '102',
      isOccupied: false,
      type: 'General',
    },
    {
      id: 'G103',
      ward: 'General',
      number: '103',
      isOccupied: false,
      type: 'General',
    },
    { id: 'I201', ward: 'ICU', number: '201', isOccupied: false, type: 'ICU' },
  ];

  private admissionsSubject = new BehaviorSubject<Admission[]>(
    this.mockAdmissions,
  );
  public admissions$ = this.admissionsSubject.asObservable();

  private bedsSubject = new BehaviorSubject<Bed[]>(this.mockBeds);
  public beds$ = this.bedsSubject.asObservable();

  constructor() {}

  getAdmissions(): Observable<Admission[]> {
    return this.admissions$.pipe(delay(500));
  }

  getBeds(): Observable<Bed[]> {
    return this.beds$.pipe(delay(500));
  }

  admitPatient(admission: Admission): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        // 1. Add Admission
        admission.id = Math.floor(Math.random() * 10000);
        admission.status = AdmissionStatus.ADMITTED;
        admission.admissionDate = new Date();
        const currentAdmissions = this.admissionsSubject.value;
        this.admissionsSubject.next([...currentAdmissions, admission]);

        // 2. Update Bed Status
        const currentBeds = this.bedsSubject.value;
        const bedIndex = currentBeds.findIndex(
          (b) => b.number === admission.bedNumber,
        );
        if (bedIndex !== -1) {
          const updatedBeds = [...currentBeds];
          updatedBeds[bedIndex] = {
            ...updatedBeds[bedIndex],
            isOccupied: true,
            patientName: admission.patientName,
          };
          this.bedsSubject.next(updatedBeds);
        }
      }),
    );
  }

  dischargePatient(admissionId: number): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        const currentAdmissions = this.admissionsSubject.value;
        const admission = currentAdmissions.find((a) => a.id === admissionId);

        if (admission) {
          // 1. Update Admission Status
          const updatedAdmissions = currentAdmissions.map((a) =>
            a.id === admissionId
              ? {
                  ...a,
                  status: AdmissionStatus.DISCHARGED,
                  dischargeDate: new Date(),
                }
              : a,
          );
          this.admissionsSubject.next(updatedAdmissions);

          // 2. Free up Bed
          const currentBeds = this.bedsSubject.value;
          const bedIndex = currentBeds.findIndex(
            (b) => b.number === admission.bedNumber,
          );
          if (bedIndex !== -1) {
            const updatedBeds = [...currentBeds];
            updatedBeds[bedIndex] = {
              ...updatedBeds[bedIndex],
              isOccupied: false,
              patientName: undefined,
            };
            this.bedsSubject.next(updatedBeds);
          }
        }
      }),
    );
  }
}
