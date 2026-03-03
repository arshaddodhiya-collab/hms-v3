import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  effect,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { BaseCrudComponent } from '../../../../shared/components/base-crud.component';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { Patient } from '../../../../core/models/patient.model';
import { TableColumn } from '../../../../shared/models/table.model';
import { PatientFacade } from '../../facades/patient.facade';

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
    private patientFacade: PatientFacade,
    private confirmationService: ConfirmationService,
  ) {
    super();
    effect(() => {
      this.data = this.patientFacade.patients();
      this.totalRecords = this.patientFacade.totalRecords();
      this.loading = this.patientFacade.loading();
    });
  }

  override ngOnInit(): void {
    const genderCol = this.cols.find((c) => c.field === 'gender');
    if (genderCol) {
      genderCol.template = this.genderTemplate;
    }
    this.refreshData();
  }

  override refreshData() {
    this.patientFacade.loadPatients();
  }

  override onSave(patientData: Patient) {
    const isUpdate = !!this.selectedItem?.id;

    if (isUpdate) {
      this.patientFacade.updatePatient(
        this.selectedItem!.id,
        patientData,
        () => {
          this.hideDialog();
          this.refreshData();
        },
      );
    } else {
      this.patientFacade.registerPatient(patientData, () => {
        this.hideDialog();
        this.refreshData();
      });
    }
  }

  // Implement delete if BaseCrudComponent calls a method for it, or just use deleteItem from template
  // If BaseCrudComponent has deleteItem and we want to override functionality:
}
