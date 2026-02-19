import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.scss'],
})
export class PatientRegisterComponent implements OnInit, OnChanges {
  @Input() isModal: boolean = false;
  @Input() patientData: Patient | null = null;
  @Output() onSave = new EventEmitter<Patient>();
  @Output() onCancel = new EventEmitter<void>();

  patientForm!: FormGroup;

  genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' },
  ];

  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.patientData) {
      this.patchForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientData'] && this.patientData && this.patientForm) {
      this.patchForm();
    }
  }

  initForm() {
    this.patientForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      dob: [null, [Validators.required]],
      gender: [null, Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  patchForm() {
    if (!this.patientData) return;

    // Handle name split
    let firstName = '';
    let lastName = '';

    if (this.patientData.name) {
      const parts = this.patientData.name.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    this.patientForm.patchValue({
      firstName: this.patientData.firstName || firstName,
      lastName: this.patientData.lastName || lastName,
      dob: this.patientData.dob ? new Date(this.patientData.dob) : null,
      gender: this.patientData.gender,
      phone: this.patientData.contact,
      email: this.patientData.email,
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      const result = {
        ...this.patientData, // Keep ID etc
        ...formValue,
        // Backend expects 'contact' instead of 'phone'
        contact: formValue.phone,
        // Format DOB to YYYY-MM-DD
        dob: this.formatDate(formValue.dob),
      };

      const request$ = this.patientData?.id
        ? this.patientService.updatePatient(this.patientData.id, result)
        : this.patientService.registerPatient(result);

      if (this.isModal) {
        this.onSave.emit(result);
      } else {
        request$.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.patientData
                ? 'Patient Updated'
                : 'Patient Registered',
            });
            setTimeout(() => {
              this.router.navigate(['/patients']);
            }, 1000);
          },
          error: (err) => {
            console.error('Error saving patient', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save patient',
            });
          },
        });
      }
    } else {
      this.patientForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fix the errors in the form',
      });
    }
  }

  cancel() {
    if (this.isModal) {
      this.onCancel.emit();
    } else {
      this.router.navigate(['/patients']);
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
