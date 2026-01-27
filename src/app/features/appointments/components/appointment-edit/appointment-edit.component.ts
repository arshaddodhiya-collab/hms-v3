import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
})
export class AppointmentEditComponent implements OnInit {
  appointmentId: string | null = null;
  appointment: any = {
    id: 101,
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: '2023-10-25',
    time: new Date('2023-10-25T10:00:00'),
    status: 'Confirmed',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    // ideally fetch from service
  }
}
