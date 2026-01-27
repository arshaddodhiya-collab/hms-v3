import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss'],
})
export class AppointmentViewComponent implements OnInit {
  appointmentId: string | null = null;
  appointment: any = {
    id: 101,
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: '2023-10-25',
    time: '10:00 AM',
    status: 'Confirmed',
    notes: 'Regular checkup',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
  }
}
