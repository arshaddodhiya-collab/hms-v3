import { Component, OnInit } from '@angular/core';

interface LabTestRequest {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  doctorName: string;
  testName: string;
  priority: 'Normal' | 'Urgent';
  status: 'Pending' | 'Sample Collected' | 'Processing';
  date: string;
}

@Component({
  selector: 'app-test-requests',
  templateUrl: './test-requests.component.html',
})
export class TestRequestsComponent implements OnInit {
  requests: LabTestRequest[] = [];

  constructor() {}

  ngOnInit() {
    this.requests = [
      {
        id: '1',
        patientName: 'John Doe',
        age: 45,
        gender: 'M',
        doctorName: 'Dr. Smith',
        testName: 'CBC (Complete Blood Count)',
        priority: 'Normal',
        status: 'Pending',
        date: '2023-10-26',
      },
      {
        id: '2',
        patientName: 'Jane Roe',
        age: 32,
        gender: 'F',
        doctorName: 'Dr. Jones',
        testName: 'Lipid Profile',
        priority: 'Urgent',
        status: 'Pending',
        date: '2023-10-26',
      },
      {
        id: '3',
        patientName: 'Bob Brown',
        age: 55,
        gender: 'M',
        doctorName: 'Dr. Smith',
        testName: 'Blood Sugar Fasting',
        priority: 'Normal',
        status: 'Sample Collected',
        date: '2023-10-25',
      },
    ];
  }

  getPrioritySeverity(
    priority: string,
  ): 'success' | 'info' | 'warning' | 'danger' | undefined {
    switch (priority) {
      case 'Urgent':
        return 'danger';
      case 'Normal':
        return 'info';
      default:
        return 'info';
    }
  }

  getStatusSeverity(
    status: string,
  ): 'success' | 'info' | 'warning' | 'danger' | undefined {
    // Note: 'primary' is not in the standard list based on error, checking valid values:
    // "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Sample Collected':
        return 'info';
      case 'Processing':
        return 'info'; // 'primary' was invalid, using 'info' or 'secondary'
      case 'Finalized':
        return 'success';
      default:
        return undefined;
    }
  }
}
