import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AppointmentRequest,
  AppointmentResponse,
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(this.apiUrl);
  }

  getAppointmentsByDate(date: string): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('date', date);
    // We might need to adjust the controller to accept a date for the general list if not restricted to doctor
    // But for now, let's stick to what's available.
    // If we want doctor specific: /doctor/{id}
    return this.http.get<AppointmentResponse[]>(`${this.apiUrl}/today`); // Fallback until we have a date filter endpoint for all
  }

  getAppointmentById(id: number): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(`${this.apiUrl}/${id}`);
  }

  // Helper to get doctor appointments if needed
  getDoctorAppointments(
    doctorId: number,
    date: string,
  ): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<AppointmentResponse[]>(
      `${this.apiUrl}/doctor/${doctorId}`,
      { params },
    );
  }

  createAppointment(
    appointment: AppointmentRequest,
  ): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(
      `${this.apiUrl}/book`,
      appointment,
    );
  }

  updateAppointment(
    id: number,
    appointment: AppointmentRequest,
  ): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.apiUrl}/${id}`,
      appointment,
    );
  }

  cancelAppointment(
    id: number,
    reason: string,
  ): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.apiUrl}/${id}/cancel`,
      reason,
    );
  }

  checkInAppointment(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.apiUrl}/${id}/check-in`,
      {},
    );
  }

  startConsultation(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(`${this.apiUrl}/${id}/start`, {});
  }

  completeAppointment(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.apiUrl}/${id}/complete`,
      {},
    );
  }

  markNoShow(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.apiUrl}/${id}/no-show`,
      {},
    );
  }

  restoreAppointment(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.apiUrl}/${id}/restore`,
      {},
    );
  }

  getPatientAppointments(
    patientId: number,
    status?: string,
  ): Observable<AppointmentResponse[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<AppointmentResponse[]>(
      `${this.apiUrl}/patient/${patientId}`,
      { params },
    );
  }

  getUpcomingAppointmentsForDoctor(
    doctorId: number,
  ): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(
      `${this.apiUrl}/doctor/${doctorId}/upcoming`,
    );
  }
}
