import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../../patients/services/patient.service';
import { UserService } from '../../../../core/services/user.service';
import { AppointmentRequest } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm!: FormGroup;
  patients: any[] = [];
  doctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadDoctors();
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      dateTime: ['', Validators.required],
      type: ['CONSULTATION', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        // Handle pagination response if needed
        this.patients = data.content || data;
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load patients',
        }),
    });
  }

  loadDoctors() {
    this.userService.getDoctors().subscribe({
      next: (data) => (this.doctors = data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load doctors',
        }),
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const dateTime = new Date(formValue.dateTime);

      const request: AppointmentRequest = {
        patientId: formValue.patientId,
        doctorId: formValue.doctorId,
        startDateTime: dateTime.toISOString(),
        endDateTime: new Date(dateTime.getTime() + 30 * 60000).toISOString(), // Default 30 mins
        type: formValue.type,
        reason: formValue.reason,
      };

      this.appointmentService.createAppointment(request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Appointment Booked Successfully',
          });
          setTimeout(() => {
            this.router.navigate(['/appointments']);
          }, 1000);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to book appointment',
          });
        },
      });
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
