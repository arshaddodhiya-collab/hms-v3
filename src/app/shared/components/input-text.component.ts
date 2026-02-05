import { Component, Input, Optional, Self, forwardRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  template: `
    <div class="field" [ngClass]="styleClass">
      <label [for]="id" class="block font-bold mb-2" *ngIf="label">{{
        label
      }}</label>

      <div
        [ngClass]="{
          'p-input-icon-left': icon && iconPosition === 'left',
          'p-input-icon-right': icon && iconPosition === 'right',
        }"
      >
        <i [class]="icon" *ngIf="icon"></i>
        <input
          [type]="type"
          pInputText
          [id]="id"
          [(ngModel)]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [ngClass]="
            'w-full ' +
            (ngControl &&
            ngControl.invalid &&
            (ngControl.dirty || ngControl.touched)
              ? 'ng-invalid ng-dirty'
              : '')
          "
          (blur)="onTouched()"
          (input)="onChange($event)"
        />
      </div>

      <ng-container
        *ngIf="
          ngControl &&
          ngControl.invalid &&
          (ngControl.dirty || ngControl.touched)
        "
      >
        <small class="p-error block mt-1" *ngIf="ngControl.errors?.['required']"
          >{{ label }} is required.</small
        >
        <small class="p-error block mt-1" *ngIf="ngControl.errors?.['email']"
          >Invalid email address.</small
        >
        <small
          class="p-error block mt-1"
          *ngIf="ngControl.errors?.['minlength']"
        >
          Minimum length is
          {{ ngControl.errors?.['minlength'].requiredLength }}.
        </small>
        <small class="p-error block mt-1" *ngIf="ngControl.errors?.['pattern']">
          Invalid format.
        </small>
      </ng-container>
    </div>
  `,
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() id: string = 'input-' + Math.random().toString(36).substr(2, 9);
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() styleClass: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  value: any = '';
  propagateChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.propagateChange(this.value);
  }
}
