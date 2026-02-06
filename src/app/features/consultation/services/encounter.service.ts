import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

export interface PrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  encounterId: string;
  items: PrescriptionItem[];
  note?: string;
  status: 'DRAFT' | 'ISSUED';
}

export interface Encounter {
  id: string;
  appointmentId: string;
  patientId: number;
  doctorId: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  diagnosis?: string;
  notes?: string;
  startedAt: Date;
  completedAt?: Date;
  vitalsId?: number; // Link to vitals if any
}

@Injectable({
  providedIn: 'root',
})
export class EncounterService {
  private encounters: Encounter[] = [];
  private prescriptions: Prescription[] = [];

  private encountersSubject = new BehaviorSubject<Encounter[]>([]);
  public encounters$ = this.encountersSubject.asObservable();

  constructor() {}

  // 1. Start or Resume Encounter
  startEncounter(
    appointmentId: string,
    patientId: number,
    doctorId: number,
  ): Observable<Encounter> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let encounter = this.encounters.find(
          (e) => e.appointmentId === appointmentId,
        );

        if (!encounter) {
          encounter = {
            id: 'ENC-' + Math.floor(Math.random() * 10000),
            appointmentId,
            patientId,
            doctorId,
            status: 'IN_PROGRESS',
            startedAt: new Date(),
          };
          this.encounters.push(encounter);
          this.encountersSubject.next([...this.encounters]);
        }

        return encounter;
      }),
    );
  }

  // 2. Save Clinical Notes
  saveDiagnosis(
    encounterId: string,
    diagnosis: string,
    notes: string,
  ): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      tap(() => {
        const index = this.encounters.findIndex((e) => e.id === encounterId);
        if (index !== -1) {
          const updated = { ...this.encounters[index], diagnosis, notes };
          this.encounters[index] = updated;
          this.encountersSubject.next([...this.encounters]);
        }
      }),
    );
  }

  // 3. Save Prescription
  savePrescription(
    encounterId: string,
    items: PrescriptionItem[],
    note?: string,
  ): Observable<Prescription> {
    return of(null).pipe(
      delay(300),
      map(() => {
        let rx = this.prescriptions.find((p) => p.encounterId === encounterId);

        if (rx) {
          rx.items = items;
          rx.note = note || rx.note;
        } else {
          rx = {
            id: 'RX-' + Math.floor(Math.random() * 10000),
            encounterId,
            items,
            note,
            status: 'DRAFT',
          };
          this.prescriptions.push(rx);
        }
        return rx;
      }),
    );
  }

  getPrescription(encounterId: string): Observable<Prescription | undefined> {
    const rx = this.prescriptions.find((p) => p.encounterId === encounterId);
    return of(rx).pipe(delay(200));
  }

  // 4. End Encounter
  endEncounter(encounterId: string): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => {
        const index = this.encounters.findIndex((e) => e.id === encounterId);
        if (index !== -1) {
          this.encounters[index].status = 'COMPLETED';
          this.encounters[index].completedAt = new Date();

          // Also Issue the Prescription
          const rx = this.prescriptions.find(
            (p) => p.encounterId === encounterId,
          );
          if (rx) {
            rx.status = 'ISSUED';
          }

          this.encountersSubject.next([...this.encounters]);
        }
      }),
    );
  }
}
