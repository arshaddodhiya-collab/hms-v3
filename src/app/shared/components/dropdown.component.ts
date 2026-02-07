import {
  Component,
  Input,
  Output,
  EventEmitter,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  template: `
    <div [class]="styleClass">
      <p-dropdown
        [options]="options"
        [(ngModel)]="value"
        [optionLabel]="optionLabel"
        [optionValue]="optionValue"
        [placeholder]="placeholder"
        [showClear]="showClear"
        [filter]="filter"
        [filterBy]="filterBy"
        [virtualScroll]="virtualScroll"
        [itemSize]="itemSize"
        [appendTo]="appendTo"
        [styleClass]="
          'w-full ' +
          inputStyleClass +
          (ngControl &&
          ngControl.invalid &&
          (ngControl.dirty || ngControl.touched)
            ? ' ng-invalid ng-dirty'
            : '')
        "
        [style]="style"
        [disabled]="disabled"
        [emptyMessage]="emptyMessage"
        (onChange)="handleChange($event)"
        (onBlur)="onTouched()"
      ></p-dropdown>
    </div>
  `,
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() optionLabel = 'label';
  @Input() optionValue: any = 'value';
  @Input() placeholder = 'Select';
  @Input() showClear = false;
  @Input() filter = false;
  @Input() filterBy = 'label';
  @Input() virtualScroll = false;
  @Input() itemSize = 30;
  @Input() appendTo = 'body';
  @Input() styleClass = '';
  @Input() inputStyleClass = '';
  @Input() style: any = { width: '100%' };
  @Input() disabled = false;
  @Input() emptyMessage = 'No results found';

  @Output() onChange = new EventEmitter<any>();

  value: any;
  propagateChange: any = () => {};
  onTouched: any = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  handleChange(event: any) {
    this.propagateChange(event.value);
    this.onChange.emit(event);
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
}
