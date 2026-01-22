import { Component, OnInit } from '@angular/core';

interface Bed {
  id: string;
  ward: string;
  status: 'Available' | 'Occupied' | 'Cleaning';
  patientName?: string;
}

@Component({
  selector: 'app-bed-management',
  templateUrl: './bed-management.component.html',
})
export class BedManagementComponent implements OnInit {
  beds: Bed[] = [];

  constructor() {}

  ngOnInit() {
    this.beds = [
      {
        id: '101',
        ward: 'General Ward A',
        status: 'Occupied',
        patientName: 'John Doe',
      },
      { id: '102', ward: 'General Ward A', status: 'Available' },
      { id: '103', ward: 'General Ward A', status: 'Cleaning' },
      {
        id: 'ICU-1',
        ward: 'ICU',
        status: 'Occupied',
        patientName: 'Critical Patient',
      },
      { id: 'ICU-2', ward: 'ICU', status: 'Available' },
    ];
  }

  getSeverity(
    status: string,
  ): 'success' | 'info' | 'warning' | 'danger' | undefined {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Occupied':
        return 'danger';
      case 'Cleaning':
        return 'warning';
      default:
        return 'info';
    }
  }
}
