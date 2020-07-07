import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export abstract class BaseSelect2Component implements ControlValueAccessor {
  @Input() id = this.getId();
  @Input() name = '';
  @Input() value: string | string[];
  @Input() placeholder = '';


  protected abstract setElementValue(newValue: string | string[]): void;

  protected onChange: any = (_: any) => {
    /*Empty*/
  }
  protected onTouched: any = () => {
    /*Empty*/
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
      this.setElementValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onBlur(): void {
    this.onTouched();
  }

  onSelectChange(value: any): void {
    this.onChange(value);
  }

  private getId(): string {
    return `${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)}-${Date.now().toString()}`;
  }
}
