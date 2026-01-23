import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-header',
  template: `
    <div
      class="flex justify-content-between align-items-center mb-4 p-3 bg-white shadow-1 border-round"
    >
      <div class="flex align-items-center gap-2">
        <button
          *ngIf="showBack"
          pButton
          type="button"
          icon="pi pi-arrow-left"
          class="p-button-rounded p-button-text p-button-secondary"
          (click)="onBack()"
        ></button>
        <i *ngIf="icon" [class]="icon" class="text-2xl text-primary mr-2"></i>
        <h1 class="text-xl font-bold m-0 text-900">{{ title }}</h1>
      </div>
      <div class="flex gap-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() showBack: boolean = false;

  constructor(private location: Location) {}

  onBack(): void {
    this.location.back();
  }
}
