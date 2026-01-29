import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  template: `
    <div *ngIf="shouldShowError()" class="p-error text-sm mt-1">
      <div *ngIf="control.hasError('required')">{{ name }} is required.</div>
      <div *ngIf="control.hasError('minlength')">
        {{ name }} must be at least
        {{ control.errors?.['minlength'].requiredLength }} characters.
      </div>
      <div *ngIf="control.hasError('email')">Invalid email address.</div>
      <div *ngIf="control.hasError('pattern')">Invalid format.</div>
      <div *ngIf="control.hasError('min')">
        Value must be greater than or equal to
        {{ control.errors?.['min'].min }}.
      </div>
      <div *ngIf="control.hasError('max')">
        Value must be less than or equal to {{ control.errors?.['max'].max }}.
      </div>
    </div>
  `,
  styles: [],
})
export class ValidationMessageComponent {
  @Input() control!: AbstractControl;
  @Input() name: string = 'Field';

  shouldShowError(): boolean {
    return !!(
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }
}
