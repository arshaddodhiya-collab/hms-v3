import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { CoreModule } from '../../core/core.module';

import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { DoctorListComponent } from './doctors/doctor-list.component';
import { UserManagementComponent } from './users/user-management.component';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { AdminLayoutComponent } from './layout/admin-layout.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    DoctorListComponent,
    UserManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    CoreModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    SidebarModule,
    BadgeModule,
    AvatarModule,
    RadioButtonModule,
    ToolbarModule,
    RippleModule,
    PaginatorModule,
    TagModule,
  ],
})
export class AdminModule {}
