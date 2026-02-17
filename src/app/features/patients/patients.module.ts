import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientRegisterComponent } from './components/patient-register/patient-register.component';
import { PatientViewComponent } from './components/patient-view/patient-view.component';
import { PatientEditComponent } from './components/patient-edit/patient-edit.component';
import { ConfirmationService } from 'primeng/api';

import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { ConsultationModule } from '../../features/consultation/consultation.module';

@NgModule({
  declarations: [
    PatientListComponent,
    PatientRegisterComponent,
    PatientViewComponent,
    PatientEditComponent,
    MedicalHistoryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PatientsRoutingModule,
    ConsultationModule,
  ],
  providers: [ConfirmationService],
})
export class PatientsModule {}
