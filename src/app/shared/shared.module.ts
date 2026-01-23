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
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';

import { PageHeaderComponent } from './components/page-header.component';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { TableComponent } from './components/table.component';
import { StatusBadgeComponent } from './components/status-badge.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    ConfirmDialogComponent,
    TableComponent,
    StatusBadgeComponent,
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
    TagModule,
    ToolbarModule,
    MenuModule,
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
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    CardModule,
    ToastModule,
    TableModule,
    DialogModule,
    TagModule,
    ToolbarModule,
    MenuModule,
  ],
})
export class SharedModule {}
