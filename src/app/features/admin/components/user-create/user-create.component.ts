import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnChanges {
  @Input() userToEdit: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  roles = [
    { label: 'Administrator', value: 'Administrator' },
    { label: 'Doctor', value: 'Doctor' },
    { label: 'Nurse', value: 'Nurse' },
    { label: 'Lab Technician', value: 'Lab Technician' },
    { label: 'Front Desk', value: 'Front Desk' },
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToEdit']) {
      if (this.userToEdit) {
        this.userForm.patchValue(this.userToEdit);
        // Password field might not be pre-filled for security, but for mock purposes:
        this.userForm.get('password')?.setValue(this.userToEdit.password);
      } else {
        this.userForm.reset();
      }
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      this.save.emit(this.userForm.value);
      this.userForm.reset();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.userForm.reset();
    this.cancel.emit();
  }
}
