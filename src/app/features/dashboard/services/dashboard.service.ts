import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardDTO {
  totalPatients: number;
  expectedAppointmentsToday: number;
  pendingLabRequests: number;
  todaysRevenue: number;
  criticalPatientsCount: number;
}

export interface ActivityDTO {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: string;
  userRoleRequiringAccess: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${this.apiUrl}/stats`);
  }

  getRecentActivity(): Observable<ActivityDTO[]> {
    return this.http.get<ActivityDTO[]>(`${this.apiUrl}/activity`);
  }
}
