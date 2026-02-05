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
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: [
        null,
        [Validators.required, Validators.min(0), Validators.max(120)],
      ],
      gender: [null, Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/),
        ],
      ],
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
      firstName: firstName,
      lastName: lastName,
      age: this.patientData.age,
      gender: this.patientData.gender,
      phone: this.patientData.contact,
      email: this.patientData.email || 'test@example.com',
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      const result = {
        ...this.patientData, // Keep ID etc
        ...formValue,
        // Reconstruct 'name' and 'contact' for the list view compatibility
        name: `${formValue.firstName} ${formValue.lastName}`,
        contact: formValue.phone,
      };

      if (this.isModal) {
        this.onSave.emit(result);
      } else {
        // Page behavior
        console.log(formValue);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient Registered Successfully',
        });
        setTimeout(() => {
          this.router.navigate(['/patients']);
        }, 1000);
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
}
