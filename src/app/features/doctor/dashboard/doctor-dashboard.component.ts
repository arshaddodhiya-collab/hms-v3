import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
})
export class DoctorDashboardComponent implements OnInit {
  stats: any[] = [];
  appointments: any[] = [];

  constructor() {}

  ngOnInit() {
    this.stats = [
      {
        label: 'Total Appointments',
        value: '12',
        icon: 'pi pi-calendar',
        color: 'blue',
      },
      {
        label: 'Pending',
        value: '5',
        icon: 'pi pi-clock',
        color: 'orange',
      },
      {
        label: 'Completed',
        value: '7',
        icon: 'pi pi-check-circle',
        color: 'green',
      },
    ];
  }
}
