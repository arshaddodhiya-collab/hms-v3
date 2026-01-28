import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VitalsSharedModule } from '../triage/vitals-shared.module';
import { ConsultationRoutingModule } from './consultation-routing.module';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { ConsultationDetailComponent } from './components/consultation-detail/consultation-detail.component';
import { DiagnosisNotesComponent } from './components/diagnosis-notes/diagnosis-notes.component';
import { PrescriptionComponent } from './components/prescription/prescription.component';

@NgModule({
  declarations: [
    ConsultationListComponent,
    ConsultationDetailComponent,
    DiagnosisNotesComponent,
    PrescriptionComponent,
  ],
  imports: [SharedModule, VitalsSharedModule, ConsultationRoutingModule],
})
export class ConsultationModule {}
