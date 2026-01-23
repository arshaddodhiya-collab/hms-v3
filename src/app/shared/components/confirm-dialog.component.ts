import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <p-dialog
      [(visible)]="isOpen"
      [header]="title"
      [modal]="true"
      [style]="{ width: '350px' }"
      (onHide)="onCancel()"
    >
      <p class="m-0">{{ message }}</p>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          icon="pi pi-times"
          (click)="onCancel()"
          styleClass="p-button-text"
        ></p-button>
        <p-button
          label="Confirm"
          icon="pi pi-check"
          (click)="onConfirm()"
          styleClass="p-button-danger"
          autofocus="true"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  // Two-way binding helper if needed, but keeping it simple to match previous API
  @Output() isOpenChange = new EventEmitter<boolean>();

  onConfirm() {
    this.confirm.emit();
    this.close();
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
