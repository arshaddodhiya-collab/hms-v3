import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab-dashboard',
  templateUrl: './lab-dashboard.component.html',
})
export class LabDashboardComponent implements OnInit {
  stats: any[] = [];

  constructor() {}

  ngOnInit() {
    this.stats = [
      {
        label: 'Total Tests',
        value: '25',
        icon: 'pi pi-flask',
        color: 'blue',
      },
      {
        label: 'Pending',
        value: '10',
        icon: 'pi pi-clock',
        color: 'orange',
      },
      {
        label: 'Completed',
        value: '15',
        icon: 'pi pi-check-circle',
        color: 'green',
      },
    ];
  }
}
