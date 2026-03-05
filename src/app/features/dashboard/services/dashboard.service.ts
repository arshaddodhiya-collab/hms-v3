import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private path = 'dashboard';

  constructor(private apiService: ApiService) {}

  getStats(): Observable<DashboardDTO> {
    return this.apiService.get<DashboardDTO>(`${this.path}/stats`);
  }

  getRecentActivity(): Observable<ActivityDTO[]> {
    const params = new HttpParams().set('size', '100');
    return this.apiService
      .get<any>(`${this.path}/activity`, params)
      .pipe(map((res) => res.content || res));
  }
}
