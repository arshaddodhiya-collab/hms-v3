import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

import { IpdRoutingModule } from './ipd-routing.module';
import { AdmissionListComponent } from './components/admission-list/admission-list.component';
import { BedManagementComponent } from './components/bed-management/bed-management.component';

import { SharedModule } from '../../shared/shared.module';
import { AdmissionFormComponent } from './components/admission-form/admission-form.component';
import { DischargeSummaryComponent } from './components/discharge-summary/discharge-summary.component';
import { RoundFormComponent } from './components/round-form/round-form.component';

@NgModule({
  declarations: [
    AdmissionListComponent,
    BedManagementComponent,
    AdmissionFormComponent,
    AdmissionFormComponent,
    DischargeSummaryComponent,
    RoundFormComponent,
  ],
  imports: [CommonModule, IpdRoutingModule, SharedModule, DividerModule],
})
export class IpdModule {}
