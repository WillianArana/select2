import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  forwardRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Renderer2,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  ContentChildren,
  QueryList
} from '@angular/core';


import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Options } from 'select2';
import { BaseSelect2Component } from 'src/app/models/base-select2.component';
import { IOptionData } from 'src/app/models/ioption-data';
import { Option2Component } from '../option2/option2.component';

declare var $: any;


const NG_SELECT_TWO: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => Select2Component),
  multi: true
};

@Component({
  selector: 'ng-select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.scss'],
  providers: [NG_SELECT_TWO],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select2Component extends BaseSelect2Component implements OnChanges, AfterViewInit {
  @ViewChild('selector', { static: true }) selector: ElementRef;

  @ContentChildren(Option2Component) options2!: QueryList<Option2Component>;

  @Input() data: Array<IOptionData> = [];
  @Input() dropdownParent = '';
  @Input() allowClear = false;
  @Input() width: string;
  @Input() disabled = false;
  @Input() options: Options;


  @Output() valueChanged = new EventEmitter<string | string[]>();

  private _element: any = undefined;
  private _check = false;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._element) {
      return;
    }

    if (changes?.data && JSON.stringify(changes?.data?.previousValue) !== JSON.stringify(changes?.data.currentValue)) {
      this.initPlugin();

      const newValue: string | string[] = this.value;
      this.setElementValue(newValue);
      this.valueChanged.emit(newValue);
      this.onChange(newValue);
    }

    if (changes?.value && changes?.value?.previousValue !== changes?.value?.currentValue) {
      const newValue: string = changes?.value?.currentValue;

      this.setElementValue(newValue);
      this.valueChanged.emit(newValue);
      this.onChange(newValue);
    }

    if (changes?.disabled && changes?.disabled?.previousValue !== changes?.disabled?.currentValue) {
      this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
    }

    if (changes?.placeholder && changes?.placeholder?.previousValue !== changes?.placeholder?.currentValue) {
      this._element.data('select2').$container.find('.select2-selection__placeholder').text(this.placeholder);
    }

    if (changes?.dropdownParent && changes?.dropdownParent?.previousValue !== changes?.dropdownParent?.currentValue) {
      this.renderer.setAttribute(this.selector.nativeElement, 'data-dropdownParent', this.dropdownParent);
    }

    if (changes?.allowClear && changes?.allowClear?.previousValue !== changes?.allowClear.currentValue) {
      this.renderer.setAttribute(this.selector.nativeElement, 'data-allow-clear', this.allowClear.toString());
    }
  }

  ngAfterViewInit(): void {
    this._element = $(this.selector.nativeElement);
    this.renderer.setAttribute(this.selector.nativeElement, 'data-dropdownParent', this.dropdownParent);
    this.renderer.setAttribute(this.selector.nativeElement, 'data-allow-clear', this.allowClear.toString());

    this.initPlugin();

    if (typeof this.value !== 'undefined') {
      this.setElementValue(this.value);
    }

    this._element.on('select2:select select2:unselect', (e: any) => {
      const newValue = this._element.val();

      this.valueChanged.emit(newValue);
      this.onChange(newValue);
    });
  }

  private initPlugin(): void {
    if (!this._element.select2 && !this._check) {
      this._check = true;
      console.error('Please add Select2 library (js file) to the project.',
        'You can download it from https://github.com/select2/select2/tree/master/dist/js.');
      return;
    }

    // If select2 already initialized remove him and remove all tags inside
    if (this._element.hasClass('select2-hidden-accessible') === true) {
      this._element.select2('destroy');
      this.renderer.setProperty(this.selector.nativeElement, 'innerHTML', '');
    }

    if (this?.data.length === 0 && this.options2?.length > 0) {
      const data = this.options2.map(op => op.content);
      this.data = data;
    }

    let options: Options = {
      data: this.data,
      width: (this.width) ? this.width : 'resolve',
      placeholder: this.placeholder
    };



    if (this.dropdownParent) {
      options = {
        data: this.data,
        width: (this.width) ? this.width : 'resolve',
        dropdownParent: $('#' + this.dropdownParent),
      };
    }

    Object.assign(options, this.options);

    if (options.matcher) {
      $.fn.select2.amd.require(['select2/compat/matcher'], (oldMatcher: any) => {
        options.matcher = oldMatcher(options.matcher);
        this._element.select2(options);

        if (typeof this.value !== 'undefined') {
          this.setElementValue(this.value);
        }
      });
    } else {
      this._element.select2(options);
    }

    this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
  }

  protected setElementValue(newValue: string | string[]): void {
    if (Array.isArray(newValue)) {

      for (const option of this.selector.nativeElement.options) {
        this.renderer.setProperty(option, 'selected', (newValue.indexOf(option.value) > -1));
      }
    } else {
      this.renderer.setProperty(this.selector.nativeElement, 'value', newValue);
    }

    if (this._element) {
      this._element.trigger('change.select2');
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.renderer.setProperty(this.selector.nativeElement, 'disabled', this.disabled);
  }

}
