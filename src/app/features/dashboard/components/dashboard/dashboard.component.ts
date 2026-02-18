import { Component, OnInit } from '@angular/core';
import { MockAuthService } from '../../../auth/services/mock-auth.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  username: string = '';
  permissions = PERMISSIONS;

  // Doctor Widget Data
  myAppointments: any[] = [];

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole = user.role;
      this.username = user.username;

      if (this.userRole === 'Doctor') {
        this.loadDoctorAppointments(user.id);
      }
    }
  }

  loadDoctorAppointments(doctorId: number) {
    this.appointmentService
      .getUpcomingAppointmentsForDoctor(doctorId)
      .subscribe(
        (
          appts: import('../../../appointments/models/appointment.model').AppointmentResponse[],
        ) => {
          this.myAppointments = appts.slice(0, 5); // Just show top 5 for widget
        },
      );
  }

  onLogout() {
    this.authService.logout();
  }
}
