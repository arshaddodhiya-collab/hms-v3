import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { EncounterResponse } from '../../../core/models/encounter.model';
import {
  VitalsRequest,
  VitalsResponse,
} from '../../../core/models/vitals.model';

@Injectable({
  providedIn: 'root',
})
export class TriageService {
  private path = 'encounters';

  constructor(private apiService: ApiService) {}

  // Get Triage Queue (Encounters with status TRIAGE)
  getTriageQueue(): Observable<EncounterResponse[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/queue/triage`, params)
      .pipe(map((res) => res.content || res));
  }

  // Get Encounter by Appointment ID
  getEncounterByAppointmentId(
    appointmentId: number,
  ): Observable<EncounterResponse> {
    return this.apiService.get<EncounterResponse>(
      `${this.path}/by-appointment/${appointmentId}`,
    );
  }

  // Record Vitals
  saveVitals(
    encounterId: number,
    vitals: VitalsRequest,
  ): Observable<VitalsResponse> {
    return this.apiService.post<VitalsResponse>(
      `${this.path}/${encounterId}/vitals`,
      vitals,
    );
  }

  // Get Vitals for an Encounter
  getVitals(encounterId: number): Observable<VitalsResponse> {
    return this.apiService.get<VitalsResponse>(
      `${this.path}/${encounterId}/vitals`,
    );
  }
}
