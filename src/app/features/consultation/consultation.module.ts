import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VitalsSharedModule } from '../triage/vitals-shared.module';
import { ConsultationRoutingModule } from './consultation-routing.module';
import { LabModule } from '../../features/lab/lab.module';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { ConsultationDetailComponent } from './components/consultation-detail/consultation-detail.component';
import { DiagnosisNotesComponent } from './components/diagnosis-notes/diagnosis-notes.component';
import { PrescriptionComponent } from './components/prescription/prescription.component';

import { ConsultationHistoryComponent } from './components/consultation-history/consultation-history.component';

@NgModule({
  declarations: [
    ConsultationListComponent,
    ConsultationDetailComponent,
    DiagnosisNotesComponent,
    PrescriptionComponent,
    ConsultationHistoryComponent,
  ],
  imports: [
    SharedModule,
    VitalsSharedModule,
    ConsultationRoutingModule,
    LabModule,
  ],
  exports: [ConsultationHistoryComponent],
})
export class ConsultationModule {}
