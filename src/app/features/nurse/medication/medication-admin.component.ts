import { Component, OnInit } from '@angular/core';

interface MedicationOrder {
  id: string;
  patientName: string;
  medicine: string;
  dosage: string;
  schedule: string; // e.g., '10:00 AM'
  status: 'Pending' | 'Given';
}

@Component({
  selector: 'app-medication-admin',
  templateUrl: './medication-admin.component.html',
})
export class MedicationAdminComponent implements OnInit {
  orders: MedicationOrder[] = [];

  constructor() {}

  ngOnInit() {
    this.orders = [
      {
        id: '1',
        patientName: 'John Doe',
        medicine: 'Paracetamol',
        dosage: '500mg',
        schedule: '08:00 AM',
        status: 'Pending',
      },
      {
        id: '2',
        patientName: 'Jane Roe',
        medicine: 'Antibiotic X',
        dosage: '250mg',
        schedule: '09:00 AM',
        status: 'Given',
      },
    ];
  }

  markGiven(order: MedicationOrder) {
    order.status = 'Given';
  }
}
