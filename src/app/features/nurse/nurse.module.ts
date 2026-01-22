import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NurseRoutingModule } from './nurse-routing.module';
import { CoreModule } from '../../core/core.module';

// Components
import { NurseLayoutComponent } from './layout/nurse-layout.component';
import { NurseDashboardComponent } from './dashboard/nurse-dashboard.component';
import { VitalsComponent } from './vitals/vitals.component';
import { BedManagementComponent } from './bed-management/bed-management.component';
import { MedicationAdminComponent } from './medication/medication-admin.component';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    NurseLayoutComponent,
    NurseDashboardComponent,
    VitalsComponent,
    BedManagementComponent,
    MedicationAdminComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NurseRoutingModule,
    CoreModule,
    ButtonModule,
    CardModule,
    TableModule,
    DialogModule,
    InputTextModule,
    TagModule,
  ],
})
export class NurseModule {}
