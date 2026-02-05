import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-header',
  template: `
    <div
      class="flex justify-content-between align-items-center mb-4 p-4 surface-card shadow-1 border-round border-left-3 border-primary"
    >
      <div class="flex align-items-center gap-3">
        <button
          *ngIf="showBack"
          pButton
          type="button"
          aria-label="Back"
          icon="pi pi-arrow-left"
          class="p-button-rounded p-button-text p-button-secondary surface-100"
          (click)="onBack()"
          pTooltip="Go back"
          tooltipPosition="right"
        ></button>

        <div
          class="flex align-items-center justify-content-center bg-primary-50 border-round p-2"
          *ngIf="icon"
        >
          <i [class]="icon" class="text-2xl text-primary"></i>
        </div>

        <div class="flex flex-column gap-1">
          <h1 class="text-2xl font-bold m-0 text-900">{{ title }}</h1>
          <span *ngIf="subtitle" class="text-500 font-medium text-sm">{{
            subtitle
          }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() showBack: boolean = false;

  constructor(private location: Location) {}

  onBack(): void {
    this.location.back();
  }
}
