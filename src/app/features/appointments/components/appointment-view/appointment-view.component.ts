import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss'],
})
export class AppointmentViewComponent implements OnInit {
  appointmentId: string | null = null;
  appointment: {
    id: number;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    status: string;
    type: string;
    department: string;
    room: string;
    reason: string;
    notes: string;
  } = {
    id: 101,
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: '2023-10-25',
    time: '10:00 AM',
    status: 'Confirmed',
    type: 'Follow-up',
    department: 'Cardiology',
    room: '304',
    reason: 'Routine checkup after surgery',
    notes: 'Patient reports feeling well. BP is stable.',
  };

  events: any[] = [
    {
      status: 'Scheduled',
      date: '2023-10-20 14:30',
      icon: 'pi pi-calendar',
      color: '#9C27B0',
    },
    {
      status: 'Confirmed',
      date: '2023-10-21 09:15',
      icon: 'pi pi-check',
      color: '#673AB7',
    },
    {
      status: 'Checked In',
      date: '2023-10-25 09:50',
      icon: 'pi pi-map-marker',
      color: '#FF9800',
    },
    {
      status: 'Completed',
      date: '2023-10-25 10:45',
      icon: 'pi pi-check-circle',
      color: '#607D8B',
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
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
