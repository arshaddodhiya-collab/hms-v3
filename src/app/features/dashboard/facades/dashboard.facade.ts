import { Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import {
  DashboardService,
  DashboardDTO,
  ActivityDTO,
} from '../services/dashboard.service';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { AppointmentResponse } from '../../appointments/models/appointment.model';
import { AuthService } from '../../auth/services/auth.service';

/**
 * DashboardFacade — Central state management for the Dashboard module.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  // --- Signals ---
  readonly stats = signal<DashboardDTO | null>(null);
  readonly activities = signal<ActivityDTO[]>([]);
  readonly myAppointments = signal<AppointmentResponse[]>([]);
  readonly loading = signal(false);
  readonly userRole = signal('');
  readonly username = signal('');

  constructor(
    private dashboardService: DashboardService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  // ==============================
  //  ACTIONS
  // ==============================

  loadDashboard(): void {
    this.loading.set(true);

    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole.set(user.role);
      this.username.set(user.username);

      if (user.role === 'Doctor') {
        this.loadDoctorAppointments(user.id);
      }
    }

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load dashboard stats',
        });
      },
    });

    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => this.activities.set(data),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load recent activity',
        });
      },
    });
  }

  private loadDoctorAppointments(doctorId: number): void {
    this.appointmentService
      .getUpcomingAppointmentsForDoctor(doctorId)
      .subscribe({
        next: (appts) => {
          this.myAppointments.set(appts.slice(0, 5));
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load your appointments',
          });
        },
      });
  }

  logout(): void {
    this.authService.logout();
  }
}
