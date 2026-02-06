import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Visit, VisitStatus } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private mockAppointments: Visit[] = [
    {
      id: 101,
      patientId: 1,
      patientName: 'John Doe',
      appointmentTime: new Date(new Date().setHours(10, 0, 0, 0)),
      status: VisitStatus.SCHEDULED,
      doctorName: 'Dr. Smith',
      department: 'Cardiology',
    },
    {
      id: 102,
      patientId: 2,
      patientName: 'Jane Smith',
      appointmentTime: new Date(new Date().setHours(14, 30, 0, 0)),
      status: VisitStatus.TRIAGE_PENDING,
      doctorName: 'Dr. Jones',
      department: 'General',
    },
  ];

  private appointmentsSubject = new BehaviorSubject<Visit[]>(
    this.mockAppointments,
  );
  public appointments$ = this.appointmentsSubject.asObservable();

  constructor() { }

  getAppointments(): Observable<Visit[]> {
    return this.appointments$.pipe(delay(500));
  }

  createAppointment(visit: Visit): Observable<Visit> {
    return of(visit).pipe(
      delay(500),
      tap((v) => {
        v.id = Math.floor(Math.random() * 10000);
        v.status = VisitStatus.SCHEDULED; // Default status
        const current = this.appointmentsSubject.value;
        this.appointmentsSubject.next([...current, v]);
      }),
    );
  }

  updateStatus(id: number, status: VisitStatus): Observable<void> {
    return of(undefined).pipe(
      delay(300),
      tap(() => {
        const current = this.appointmentsSubject.value;
        const index = current.findIndex((x) => x.id === id);
        if (index !== -1) {
          const updatedRef = { ...current[index], status };
          const updatedList = [...current];
          updatedList[index] = updatedRef;
          this.appointmentsSubject.next(updatedList);
        }
      }),
    );
  }
}
