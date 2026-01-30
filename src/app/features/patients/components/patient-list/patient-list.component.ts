import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit, AfterViewInit {
  @ViewChild('genderTemplate') genderTemplate!: TemplateRef<any>;

  patients = [
    { id: 1, name: 'John Doe', age: 30, gender: 'Male', contact: '1234567890' },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      gender: 'Female',
      contact: '0987654321',
    },
  ];

  displayDialog: boolean = false;
  selectedPatient: any = null;

  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
    { field: 'gender', header: 'Gender' },
    { field: 'contact', header: 'Contact' },
  ];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const genderCol = this.cols.find((c) => c.field === 'gender');
    if (genderCol) {
      genderCol.template = this.genderTemplate;
    }
  }

  openNew() {
    this.selectedPatient = null;
    this.displayDialog = true;
  }

  editPatient(patient: any) {
    this.selectedPatient = { ...patient };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedPatient = null;
  }

  savePatient(patientData: any) {
    // ... logic same ...
    if (this.selectedPatient) {
      // Existing Logic for update...
      // Since the mock data in this component is hardcoded in specific way in original file
      // I'll reuse the logic from previous version if I had the full content,
      // but here we are replacing the class so I must rewrite the logic
      const index = this.patients.findIndex(
        (x) => x.id === this.selectedPatient.id,
      );
      if (index !== -1) {
        this.patients[index] = { ...this.patients[index], ...patientData };
      }
    } else {
      const newPatient = { ...patientData, id: this.patients.length + 1 };
      this.patients.push(newPatient);
    }

    // Trigger change detection for table
    this.patients = [...this.patients];
    this.hideDialog();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Patient Saved',
    });
  }
}
