import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PatientService } from '../../../patients/services/patient.service';
import { UserService } from '../../../../core/services/user.service';
import { AppointmentRequest } from '../../models/appointment.model';
import { AppointmentFacade } from '../../facades/appointment.facade';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentCreateComponent implements OnInit {
  appointmentForm!: FormGroup;
  patients: any[] = [];
  doctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    public facade: AppointmentFacade,
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
        endDateTime: new Date(dateTime.getTime() + 30 * 60000).toISOString(),
        type: formValue.type,
        reason: formValue.reason,
      };

      this.facade.createAppointment(request, () => {
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 1000);
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
