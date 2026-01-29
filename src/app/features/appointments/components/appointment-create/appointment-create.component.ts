import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      console.log(this.appointmentForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointment Booked Successfully',
      });
      setTimeout(() => {
        this.router.navigate(['/appointments']);
      }, 1000);
    } else {
      this.appointmentForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fix the errors in the form',
      });
    }
  }
}
