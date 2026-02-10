import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { Patient } from '../../../../core/models/patient.model';
import { TableColumn } from '../../../../shared/models/table.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent
  extends BaseCrudComponent<Patient>
  implements OnInit
{
  @ViewChild('genderTemplate', { static: true }) genderTemplate!: TemplateRef<{
    $implicit: unknown;
    row: Patient;
  }>;

  permissions = PERMISSIONS;

  cols: TableColumn<Patient>[] = [
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'age', header: 'Age' },
    { field: 'gender', header: 'Gender' },
    { field: 'contact', header: 'Contact' },
  ];

  constructor(
    private messageService: MessageService,
    private patientService: PatientService,
    private confirmationService: ConfirmationService,
  ) {
    super();
  }

  override ngOnInit(): void {
    const genderCol = this.cols.find((c) => c.field === 'gender');
    if (genderCol) {
      genderCol.template = this.genderTemplate;
    }
    this.refreshData();
  }

  override refreshData() {
    this.loading = true;
    this.patientService.getPatients().subscribe({
      next: (response) => {
        this.data = response.content;
        this.totalRecords = response.totalElements; // If BaseCrudComponent supports pagination
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patients', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patients',
        });
      },
    });
  }

  override onSave(patientData: Patient) {
    // Determine if update or create based on existence of ID in selectedItem or patientData
    const isUpdate = !!this.selectedItem?.id;

    // We can use an observable to handle both cases cleanly
    const request$ = isUpdate
      ? this.patientService.updatePatient(this.selectedItem!.id, patientData)
      : this.patientService.registerPatient(patientData);

    request$.subscribe({
      next: () => {
        this.hideDialog();
        this.refreshData();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: isUpdate ? 'Patient Updated' : 'Patient Registered',
        });
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

  // Implement delete if BaseCrudComponent calls a method for it, or just use deleteItem from template
  // If BaseCrudComponent has deleteItem and we want to override functionality:
}
