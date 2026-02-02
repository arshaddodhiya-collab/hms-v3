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
import { Department } from '../../services/admin.service';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss'],
})
export class DepartmentCreateComponent implements OnChanges {
  @Input() deptToEdit: Department | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  deptForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.deptForm = this.fb.group({
      name: ['', Validators.required],
      head: ['', Validators.required],
      staffCount: [0, [Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['deptToEdit']) {
      if (this.deptToEdit) {
        this.deptForm.patchValue(this.deptToEdit);
      } else {
        this.deptForm.reset({ staffCount: 0 });
      }
    }
  }

  saveDepartment(): void {
    if (this.deptForm.valid) {
      this.save.emit(this.deptForm.value);
      this.deptForm.reset({ staffCount: 0 });
    } else {
      this.deptForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.deptForm.reset({ staffCount: 0 });
    this.cancel.emit();
  }
}
