import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';

import { PageHeaderComponent } from './components/page-header.component';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { TableComponent } from './components/table.component';
import { StatusBadgeComponent } from './components/status-badge.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    ConfirmDialogComponent,
    TableComponent,
    StatusBadgeComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    TableModule,
    DialogModule,
    MenuModule,
    SidebarModule,
    AvatarModule,
    BadgeModule,
    TagModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // Components
    PageHeaderComponent,
    ConfirmDialogComponent,
    TableComponent,
    StatusBadgeComponent,
    SidebarComponent,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    TableModule,
    DialogModule,
    MenuModule,
    SidebarModule,
    AvatarModule,
    BadgeModule,
    TagModule,
  ],
})
export class SharedModule {}
