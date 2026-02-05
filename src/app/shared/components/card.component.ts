import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card" [ngClass]="styleClass">
      <div
        class="card-header flex justify-content-between align-items-center mb-4"
        *ngIf="header || headerTemplate"
      >
        <div>
          <h4 class="m-0" *ngIf="header">{{ header }}</h4>
          <small class="text-500" *ngIf="subheader">{{ subheader }}</small>
        </div>
        <ng-content select="[header]"></ng-content>
      </div>
      <div [class]="contentStyleClass">
        <ng-content></ng-content>
      </div>
      <div
        class="card-footer mt-4 flex justify-content-end gap-2"
        *ngIf="footerTemplate"
      >
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class CardComponent {
  @Input() header: string = '';
  @Input() subheader: string = '';
  @Input() styleClass: string = '';
  @Input() contentStyleClass: string = '';

  @ContentChild('header') headerTemplate!: TemplateRef<any>;
  @ContentChild('footer') footerTemplate!: TemplateRef<any>;
}
