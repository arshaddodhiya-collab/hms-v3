import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(this.path, params)
      .pipe(map((res) => res.content || res));
  }

  getAppointmentsByDate(date: string): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('date', date).set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/today`, params)
      .pipe(map((res) => res.content || res));
  }

  getAppointmentById(id: number): Observable<AppointmentResponse> {
    return this.apiService.get<AppointmentResponse>(`${this.path}/${id}`);
  }

  // Helper to get doctor appointments if needed
  getDoctorAppointments(
    doctorId: number,
    date: string,
  ): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('date', date).set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/doctor/${doctorId}`, params)
      .pipe(map((res) => res.content || res));
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
    let params = new HttpParams().set('size', '100');
    if (status) {
      params = params.set('status', status);
    }
    return this.apiService
      .get<any>(`${this.path}/patient/${patientId}`, params)
      .pipe(map((res) => res.content || res));
  }

  getUpcomingAppointmentsForDoctor(
    doctorId: number,
  ): Observable<AppointmentResponse[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/doctor/${doctorId}/upcoming`, params)
      .pipe(map((res) => res.content || res));
  }
}
