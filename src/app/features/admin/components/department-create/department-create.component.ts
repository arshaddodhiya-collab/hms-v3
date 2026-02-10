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
import { AdminService } from '../../services/admin.service';
import { Department } from '../../../../core/models/department.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss'],
})
export class DepartmentCreateComponent implements OnChanges, OnInit {
  @Input() deptToEdit: Department | null = null;
  @Output() save = new EventEmitter<Department>();
  @Output() cancel = new EventEmitter<void>();

  deptForm: FormGroup;
  users: User[] = [];

  departmentNames = [
    { label: 'General', value: 'General' },
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'Gynecology', value: 'Gynecology' },
    { label: 'Dermatology', value: 'Dermatology' },
    { label: 'Ophthalmology', value: 'Ophthalmology' },
    { label: 'Emergency', value: 'Emergency' },
    { label: 'Radiology', value: 'Radiology' },
    { label: 'Pathology', value: 'Pathology' },
    { label: 'Pharmacy', value: 'Pharmacy' },
    { label: 'Administration', value: 'Administration' },
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
  ) {
    this.deptForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      headOfDepartmentId: [null], // We will map this to User ID
      active: [true],
    });
  }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deptToEdit']) {
      if (this.deptToEdit) {
        this.deptForm.patchValue({
          name: this.deptToEdit.name,
          description: this.deptToEdit.description,
          headOfDepartmentId: this.deptToEdit.headOfDepartmentId,
          active: this.deptToEdit.active,
        });
      } else {
        this.deptForm.reset({ active: true });
      }
    }
  }

  saveDepartment(): void {
    if (this.deptForm.valid) {
      const formValue = this.deptForm.value;
      const department: Department = {
        ...(this.deptToEdit ? { id: this.deptToEdit.id } : ({} as any)),
        ...formValue,
        staffCount: this.deptToEdit ? this.deptToEdit.staffCount : 0, // Backend handles real count, but preserve for UI state if needed
      };
      this.save.emit(department);
      this.deptForm.reset({ active: true });
    } else {
      this.deptForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.deptForm.reset({ active: true });
    this.cancel.emit();
  }
}
