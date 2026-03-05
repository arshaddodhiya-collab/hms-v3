import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private path = 'encounters';

  constructor(private apiService: ApiService) {}

  // 1. Start or Resume Encounter
  startEncounter(
    request: EncounterCreateRequest,
  ): Observable<EncounterResponse> {
    return this.apiService.post<EncounterResponse>(this.path, request);
  }

  getEncounterById(id: number): Observable<EncounterResponse> {
    return this.apiService.get<EncounterResponse>(`${this.path}/${id}`);
  }

  getEncounterByAppointmentId(
    appointmentId: number,
  ): Observable<EncounterResponse> {
    return this.apiService.get<EncounterResponse>(
      `${this.path}/by-appointment/${appointmentId}`,
    );
  }

  // 2. Save Clinical Notes
  updateClinicalNotes(
    id: number,
    request: EncounterUpdateRequest,
  ): Observable<EncounterResponse> {
    return this.apiService.patch<EncounterResponse>(
      `${this.path}/${id}/clinical-notes`,
      request,
    );
  }

  // 3. Save Prescription
  savePrescription(
    encounterId: number,
    request: PrescriptionRequest,
  ): Observable<PrescriptionResponse> {
    return this.apiService.post<PrescriptionResponse>(
      `${this.path}/${encounterId}/prescriptions`,
      request,
    );
  }

  getPrescription(encounterId: number): Observable<PrescriptionResponse> {
    return this.apiService.get<PrescriptionResponse>(
      `${this.path}/${encounterId}/prescriptions`,
    );
  }

  // 4. End Encounter
  completeEncounter(id: number): Observable<EncounterResponse> {
    return this.apiService.patch<EncounterResponse>(
      `${this.path}/${id}/complete`,
      {},
    );
  }

  // queue
  getDoctorQueue(doctorId: number): Observable<EncounterResponse[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/queue/doctor/${doctorId}`, params)
      .pipe(map((res) => res.content || res));
  }

  getOpdDoctorQueue(doctorId: number): Observable<EncounterResponse[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/queue/opd/doctor/${doctorId}`, params)
      .pipe(map((res) => res.content || res));
  }

  // Get patient encounter history
  getPatientEncounters(patientId: number): Observable<EncounterResponse[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/patient/${patientId}`, params)
      .pipe(map((res) => res.content || res));
  }
}
