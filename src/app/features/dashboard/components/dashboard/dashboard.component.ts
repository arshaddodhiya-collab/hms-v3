import { Component, OnInit } from '@angular/core';
import { MockAuthService } from '../../../../core/services/mock-auth.service';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AppointmentService } from '../../../../core/services/appointment.service';

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
    private authService: MockAuthService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole = user.role;
      this.username = user.username;

      if (this.userRole === 'Doctor') {
        this.loadDoctorAppointments();
      }
    }
  }

  loadDoctorAppointments() {
    this.appointmentService.getAppointments().subscribe((appts) => {
      // Mock filter: In real app, filter by this.user.id
      this.myAppointments = appts.slice(0, 5); // Just show top 5 for widget
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
