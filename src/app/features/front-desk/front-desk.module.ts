import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrontDeskRoutingModule } from './front-desk-routing.module';

import { FrontDeskLayoutComponent } from './layout/front-desk-layout.component';
import { FrontDeskDashboardComponent } from './front-desk-dashboard/front-desk-dashboard.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { AppointmentListComponent } from './appointments/appointment-list.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    FrontDeskLayoutComponent,
    FrontDeskDashboardComponent,
    RegisterPatientComponent,
    AppointmentListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FrontDeskRoutingModule,
    ButtonModule,
    CardModule,
    SidebarModule,
    AvatarModule,
    RippleModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    TableModule,
    DialogModule,
    ToastModule,
    ToolbarModule,
    TagModule,
    CoreModule,
  ],
})
export class FrontDeskModule {}
