import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../../patients/services/patient.service';
import { UserService } from '../../../../core/services/user.service';
import {
  AppointmentRequest,
  AppointmentResponse,
} from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
})
export class AppointmentEditComponent implements OnInit {
  appointmentId: number | null = null;
  appointmentForm!: FormGroup;
  patients: any[] = [];
  doctors: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadDoctors();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId = +id;
      this.loadAppointment(this.appointmentId);
    }
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      dateTime: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      status: [''], // Optional, if we want to show status or allow limited editing
    });
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => (this.patients = data.content || data),
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

  loadAppointment(id: number) {
    this.loading = true;
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (data) => {
        this.loading = false;
        // Patch form
        this.appointmentForm.patchValue({
          patientId: data.patientId,
          doctorId: data.doctorId,
          dateTime: new Date(data.startDateTime), // Convert ISO string to Date for Calendar
          type: data.type,
          reason: data.reason,
          status: data.status,
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load appointment details',
        });
      },
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid && this.appointmentId) {
      const formValue = this.appointmentForm.value;
      const dateTime = new Date(formValue.dateTime);

      const request: AppointmentRequest = {
        patientId: formValue.patientId,
        doctorId: formValue.doctorId,
        startDateTime: dateTime.toISOString(),
        endDateTime: new Date(dateTime.getTime() + 30 * 60000).toISOString(), // Keep 30 mins duration or calculate difference if end time was editable
        type: formValue.type,
        reason: formValue.reason,
        status: formValue.status,
      };

      this.appointmentService
        .updateAppointment(this.appointmentId, request)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Appointment Updated Successfully',
            });
            setTimeout(() => {
              this.router.navigate(['/appointments']);
            }, 1000);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to update appointment',
            });
          },
        });
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }
}
