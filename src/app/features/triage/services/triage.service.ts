import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EncounterResponse } from '../../../core/models/encounter.model';
import {
  VitalsRequest,
  VitalsResponse,
} from '../../../core/models/vitals.model';

@Injectable({
  providedIn: 'root',
})
export class TriageService {
  private apiUrl = `${environment.apiUrl}/encounters`;

  constructor(private http: HttpClient) {}

  // Get Triage Queue (Encounters with status TRIAGE)
  getTriageQueue(): Observable<EncounterResponse[]> {
    return this.http.get<EncounterResponse[]>(`${this.apiUrl}/queue/triage`);
  }

  // Get Encounter by Appointment ID
  getEncounterByAppointmentId(
    appointmentId: number,
  ): Observable<EncounterResponse> {
    return this.http.get<EncounterResponse>(
      `${this.apiUrl}/by-appointment/${appointmentId}`,
    );
  }

  // Record Vitals
  saveVitals(
    encounterId: number,
    vitals: VitalsRequest,
  ): Observable<VitalsResponse> {
    return this.http.post<VitalsResponse>(
      `${this.apiUrl}/${encounterId}/vitals`,
      vitals,
    );
  }

  // Get Vitals for an Encounter
  getVitals(encounterId: number): Observable<VitalsResponse> {
    return this.http.get<VitalsResponse>(
      `${this.apiUrl}/${encounterId}/vitals`,
    );
  }
}
