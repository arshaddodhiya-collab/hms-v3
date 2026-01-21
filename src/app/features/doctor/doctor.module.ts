import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorRoutingModule } from './doctor-routing.module';
import { CoreModule } from '../../core/core.module';

import { DoctorLayoutComponent } from './layout/doctor-layout.component';
import { DoctorDashboardComponent } from './dashboard/doctor-dashboard.component';
import { DoctorScheduleComponent } from './schedule/doctor-schedule.component';
import { ConsultationComponent } from './consultation/consultation.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    DoctorLayoutComponent,
    DoctorDashboardComponent,
    DoctorScheduleComponent,
    ConsultationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DoctorRoutingModule,
    CoreModule,
    TableModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    TagModule,
  ],
})
export class DoctorModule {}
