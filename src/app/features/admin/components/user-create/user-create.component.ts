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
import { User } from '../../../../core/models/user.model';
import { Department } from '../../../../core/models/department.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnChanges, OnInit {
  @Input() userToEdit: User | null = null;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  departments: Department[] = [];
  roles = [
    { label: 'Administrator', value: 'ADMIN' },
    { label: 'Doctor', value: 'DOCTOR' },
    { label: 'Nurse', value: 'NURSE' },
    { label: 'Lab Technician', value: 'LAB_TECH' },
    { label: 'Front Desk', value: 'RECEPTION' },
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required], // Note: In real app, password might be optional on edit
      fullName: ['', Validators.required],
      role: ['', Validators.required], // We maps this to roles array [role]
      departmentId: [null],
      active: [true],
    });
  }

  ngOnInit(): void {
    this.adminService.getDepartments().subscribe((depts) => {
      this.departments = depts;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToEdit']) {
      if (this.userToEdit) {
        this.userForm.patchValue({
          username: this.userToEdit.username,
          fullName: this.userToEdit.fullName,
          role:
            this.userToEdit.roles && this.userToEdit.roles.length > 0
              ? this.userToEdit.roles[0]
              : '', // Simplified for single role selection
          departmentId: this.userToEdit.departmentId,
          active: this.userToEdit.active,
        });
        // Remove password validator on edit if we don't want to force change
        // For now, keep it simple, maybe require password always or never fill it
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        this.userForm.reset({ active: true });
        this.userForm.get('password')?.setValidators(Validators.required);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    }
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const user: User = {
        ...(this.userToEdit ? { id: this.userToEdit.id } : ({} as any)),
        username: formValue.username,
        fullName: formValue.fullName,
        active: formValue.active,
        departmentId: formValue.departmentId,
        roles: [formValue.role], // Map single selection to array
        password: formValue.password,
      };

      this.save.emit(user);
      this.userForm.reset({ active: true });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.userForm.reset();
    this.cancel.emit();
  }
}
