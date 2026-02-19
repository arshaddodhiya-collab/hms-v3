import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PatientService } from '../../../patients/services/patient.service';
import { UserService } from '../../../../core/services/user.service';
import { AppointmentRequest } from '../../models/appointment.model';
import { AppointmentFacade } from '../../facades/appointment.facade';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentEditComponent implements OnInit {
  appointmentId: number | null = null;
  appointmentForm!: FormGroup;
  patients: any[] = [];
  doctors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public facade: AppointmentFacade,
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
      status: [''],
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
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (data) => {
        this.appointmentForm.patchValue({
          patientId: data.patientId,
          doctorId: data.doctorId,
          dateTime: new Date(data.startDateTime),
          type: data.type,
          reason: data.reason,
          status: data.status,
        });
      },
      error: () => {
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
        endDateTime: new Date(dateTime.getTime() + 30 * 60000).toISOString(),
        type: formValue.type,
        reason: formValue.reason,
        status: formValue.status,
      };

      this.facade.updateAppointment(this.appointmentId, request, () => {
        setTimeout(() => {
          this.router.navigate(['/appointments']);
        }, 1000);
      });
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }
}
