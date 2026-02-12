import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { AppointmentStatus } from '../../../core/models/patient.model';

export interface Vitals {
  appointmentId: number;
  temperature: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  weight: number;
  height: number;
  spo2: number;
  bmi: number;
  recordedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TriageService {
  // Mock Storage for Vitals
  private vitalsMap = new Map<number, Vitals>();

  constructor(private appointmentService: AppointmentService) {}

  saveVitals(vitals: Vitals): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        this.vitalsMap.set(vitals.appointmentId, vitals);
        // Auto-update appointment status to CONSULTATION_PENDING (Checked In)
        this.appointmentService
          .checkInAppointment(vitals.appointmentId)
          .subscribe();
      }),
    );
  }

  getVitals(appointmentId: number): Observable<Vitals | undefined> {
    return of(this.vitalsMap.get(appointmentId)).pipe(delay(300));
  }
}
