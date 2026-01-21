import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  invoices: any[] = [];

  constructor() {}

  ngOnInit() {
    this.invoices = [
      {
        id: 'INV-001',
        patientName: 'John Doe',
        amount: 150.0,
        status: 'Paid',
        date: '2023-10-25',
      },
      {
        id: 'INV-002',
        patientName: 'Jane Smith',
        amount: 200.0,
        status: 'Pending',
        date: '2023-10-26',
      },
      {
        id: 'INV-003',
        patientName: 'Robert Brown',
        amount: 50.0,
        status: 'Unpaid',
        date: '2023-10-27',
      },
    ];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Unpaid':
        return 'danger';
      default:
        return 'info';
    }
  }
}
