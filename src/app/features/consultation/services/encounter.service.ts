import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  EncounterResponse,
  EncounterCreateRequest,
  EncounterUpdateRequest,
} from '../../../core/models/encounter.model';
import {
  PrescriptionRequest,
  PrescriptionResponse,
} from '../../../core/models/prescription.model';

@Injectable({
  providedIn: 'root',
})
export class EncounterService {
  private apiUrl = `${environment.apiUrl}/encounters`;

  constructor(private http: HttpClient) {}

  // 1. Start or Resume Encounter
  startEncounter(
    request: EncounterCreateRequest,
  ): Observable<EncounterResponse> {
    return this.http.post<EncounterResponse>(this.apiUrl, request);
  }

  getEncounterById(id: number): Observable<EncounterResponse> {
    return this.http.get<EncounterResponse>(`${this.apiUrl}/${id}`);
  }

  getEncounterByAppointmentId(
    appointmentId: number,
  ): Observable<EncounterResponse> {
    return this.http.get<EncounterResponse>(
      `${this.apiUrl}/by-appointment/${appointmentId}`,
    );
  }

  // 2. Save Clinical Notes
  updateClinicalNotes(
    id: number,
    request: EncounterUpdateRequest,
  ): Observable<EncounterResponse> {
    return this.http.patch<EncounterResponse>(
      `${this.apiUrl}/${id}/clinical-notes`,
      request,
    );
  }

  // 3. Save Prescription
  savePrescription(
    encounterId: number,
    request: PrescriptionRequest,
  ): Observable<PrescriptionResponse> {
    return this.http.post<PrescriptionResponse>(
      `${this.apiUrl}/${encounterId}/prescriptions`,
      request,
    );
  }

  getPrescription(encounterId: number): Observable<PrescriptionResponse> {
    return this.http.get<PrescriptionResponse>(
      `${this.apiUrl}/${encounterId}/prescriptions`,
    );
  }

  // 4. End Encounter
  completeEncounter(id: number): Observable<EncounterResponse> {
    return this.http.patch<EncounterResponse>(
      `${this.apiUrl}/${id}/complete`,
      {},
    );
  }

  // queue
  getDoctorQueue(doctorId: number): Observable<EncounterResponse[]> {
    return this.http.get<EncounterResponse[]>(
      `${this.apiUrl}/queue/doctor/${doctorId}`,
    );
  }

  // Get patient encounter history
  getPatientEncounters(patientId: number): Observable<EncounterResponse[]> {
    return this.http.get<EncounterResponse[]>(
      `${this.apiUrl}/patient/${patientId}`,
    );
  }
}
