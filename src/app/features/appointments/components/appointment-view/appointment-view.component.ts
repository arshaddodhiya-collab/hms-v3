import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentResponse } from '../../models/appointment.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss'],
})
export class AppointmentViewComponent implements OnInit {
  appointmentId: number | null = null;
  appointment: AppointmentResponse | null = null;

  events: any[] = []; // Timeline events - to be implemented later based on status history if available

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId = +id;
      this.loadAppointment(this.appointmentId);
    }
  }

  loadAppointment(id: number) {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (data) => {
        this.appointment = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load appointment details',
        });
      },
    });
  }

  getSeverity(
    status: string,
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Scheduled':
        return 'info';
      case 'Completed':
        return 'success';
      default:
        return 'info';
    }
  }
}
