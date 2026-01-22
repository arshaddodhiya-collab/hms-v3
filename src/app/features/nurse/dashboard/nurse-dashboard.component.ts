import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nurse-dashboard',
  templateUrl: './nurse-dashboard.component.html',
})
export class NurseDashboardComponent implements OnInit {
  stats: any[] = [];

  constructor() {}

  ngOnInit() {
    this.stats = [
      {
        label: 'Admitted Patients',
        value: '45',
        icon: 'pi pi-users',
        color: 'blue',
      },
      {
        label: 'Critical attention', // e.g. abnormal vitals
        value: '3',
        icon: 'pi pi-exclamation-triangle',
        color: 'red',
      },
      {
        label: 'Available Beds',
        value: '12',
        icon: 'pi pi-inbox',
        color: 'green',
      },
      {
        label: 'Pending Meds',
        value: '8',
        icon: 'pi pi-clock',
        color: 'orange',
      },
    ];
  }
}
