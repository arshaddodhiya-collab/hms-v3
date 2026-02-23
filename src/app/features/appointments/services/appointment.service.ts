import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  AppointmentRequest,
  AppointmentResponse,
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private path = 'appointments';

  constructor(private apiService: ApiService) {}

  getAppointments(): Observable<AppointmentResponse[]> {
    return this.apiService.get<AppointmentResponse[]>(this.path);
  }

  getAppointmentsByDate(date: string): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('date', date);
    // We might need to adjust the controller to accept a date for the general list if not restricted to doctor
    // But for now, let's stick to what's available.
    // If we want doctor specific: /doctor/{id}
    return this.apiService.get<AppointmentResponse[]>(`${this.path}/today`); // Fallback until we have a date filter endpoint for all
  }

  getAppointmentById(id: number): Observable<AppointmentResponse> {
    return this.apiService.get<AppointmentResponse>(`${this.path}/${id}`);
  }

  // Helper to get doctor appointments if needed
  getDoctorAppointments(
    doctorId: number,
    date: string,
  ): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('date', date);
    return this.apiService.get<AppointmentResponse[]>(
      `${this.path}/doctor/${doctorId}`,
      params,
    );
  }

  createAppointment(
    appointment: AppointmentRequest,
  ): Observable<AppointmentResponse> {
    return this.apiService.post<AppointmentResponse>(
      `${this.path}/book`,
      appointment,
    );
  }

  updateAppointment(
    id: number,
    appointment: AppointmentRequest,
  ): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}`,
      appointment,
    );
  }

  cancelAppointment(
    id: number,
    reason: string,
  ): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}/cancel`,
      reason,
    );
  }

  checkInAppointment(id: number): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}/check-in`,
      {},
    );
  }

  startConsultation(id: number): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}/start`,
      {},
    );
  }

  completeAppointment(id: number): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}/complete`,
      {},
    );
  }

  markNoShow(id: number): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}/no-show`,
      {},
    );
  }

  restoreAppointment(id: number): Observable<AppointmentResponse> {
    return this.apiService.put<AppointmentResponse>(
      `${this.path}/${id}/restore`,
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
    return this.apiService.get<AppointmentResponse[]>(
      `${this.path}/patient/${patientId}`,
      params,
    );
  }

  getUpcomingAppointmentsForDoctor(
    doctorId: number,
  ): Observable<AppointmentResponse[]> {
    return this.apiService.get<AppointmentResponse[]>(
      `${this.path}/doctor/${doctorId}/upcoming`,
    );
  }
}
