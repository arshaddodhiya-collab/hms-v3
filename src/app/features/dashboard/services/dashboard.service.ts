import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';

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
    return this.apiService.get<ActivityDTO[]>(`${this.path}/activity`);
  }
}
