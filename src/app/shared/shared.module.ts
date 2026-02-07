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
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';

import { PageHeaderComponent } from './components/page-header.component';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { TableComponent } from './components/table.component';
import { StatusBadgeComponent } from './components/status-badge.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HasPermissionDirective } from './directives/has-permission.directive';

import { ValidationMessageComponent } from './components/validation-message/validation-message.component';

import { VoiceHudComponent } from './components/voice-hud/voice-hud.component';
import { VoiceInputDirective } from './directives/voice-input.directive';
import { DropdownComponent } from './components/dropdown.component';
import { CardComponent } from './components/card.component';
import { InputTextComponent } from './components/input-text.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    ConfirmDialogComponent,
    TableComponent,
    StatusBadgeComponent,
    SidebarComponent,
    HasPermissionDirective,
    ValidationMessageComponent,
    VoiceHudComponent,
    VoiceInputDirective,
    DropdownComponent,
    CardComponent,
    InputTextComponent,
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
    ToolbarModule,
    RippleModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    InputTextareaModule,
    CheckboxModule,
    InputNumberModule,
    DividerModule,
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
    HasPermissionDirective,
    ValidationMessageComponent,
    VoiceHudComponent,
    VoiceInputDirective,
    DropdownComponent,
    CardComponent,
    InputTextComponent,
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
    ToolbarModule,
    RippleModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    InputTextareaModule,
    CheckboxModule,
    InputNumberModule,
    DividerModule,
  ],
})
export class SharedModule {}
