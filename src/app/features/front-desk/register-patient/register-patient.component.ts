import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.scss'],
})
export class RegisterPatientComponent {
  patient: any = {
    firstName: '',
    lastName: '',
    age: null,
    gender: 'Male',
    contact: '',
    email: '',
    address: '',
  };

  genders: any[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  constructor(private router: Router) {}

  register() {
    console.log('Registering patient:', this.patient);
    // In a real app, call service to save patient.
    // For now, simulate success.

    // Check if valid? (Simple check)
    if (
      this.patient.firstName &&
      this.patient.lastName &&
      this.patient.contact
    ) {
      // Show toast or alert?
      alert('Patient Registered Successfully!');
      this.router.navigate(['/reception/dashboard']);
    } else {
      alert('Please fill required fields.');
    }
  }
}
