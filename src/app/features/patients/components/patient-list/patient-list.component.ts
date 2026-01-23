import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  patients = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male', contact: '1234567890' },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      gender: 'Female',
      contact: '0987654321',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
