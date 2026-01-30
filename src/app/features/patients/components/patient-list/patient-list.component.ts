import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent
  extends BaseCrudComponent<any>
  implements OnInit, AfterViewInit
{
  @ViewChild('genderTemplate') genderTemplate!: TemplateRef<any>;

  permissions = PERMISSIONS;

  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
    { field: 'gender', header: 'Gender' },
    { field: 'contact', header: 'Contact' },
  ];

  constructor(private messageService: MessageService) {
    super();
  }

  override ngOnInit(): void {
    this.refreshData();
  }

  override refreshData() {
    this.data = [
      {
        id: 1,
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        contact: '1234567890',
      },
      {
        id: 2,
        name: 'Jane Smith',
        age: 25,
        gender: 'Female',
        contact: '0987654321',
      },
    ];
  }

  ngAfterViewInit() {
    const genderCol = this.cols.find((c) => c.field === 'gender');
    if (genderCol) {
      genderCol.template = this.genderTemplate;
    }
  }

  override onSave(patientData: any) {
    // Logic adapted to use this.selectedItem (which corresponds to selectedPatient)
    // Actually, onSave receives patientData from event.
    // BaseCrudComponent has abstract onSave(item: any).
    // The previous logic used this.selectedPatient to decide update vs create.
    // Base sets selectedItem in editItem.

    if (this.selectedItem) {
      // Update
      const index = this.data.findIndex((x) => x.id === this.selectedItem.id);
      if (index !== -1) {
        // Merge updates
        this.data[index] = { ...this.data[index], ...patientData };
      }
    } else {
      // Create
      const newPatient = { ...patientData, id: this.data.length + 1 };
      this.data.push(newPatient);
    }

    // Trigger change detection for table
    this.data = [...this.data];
    this.hideDialog();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Patient Saved',
    });
  }
}
