import { Component, AfterViewInit, ElementRef, Input } from '@angular/core';
import { IOptionData } from 'src/app/models/ioption-data';

@Component({
  selector: 'ng-option2',
  templateUrl: './option2.component.html',
  styleUrls: ['./option2.component.scss']
})
export class Option2Component implements IOptionData, AfterViewInit {
  @Input() id: string;
  @Input() text: string;
  @Input() disabled?: boolean;
  @Input() children?: Array<IOptionData>;
  @Input() additional?: any;

  content!: any;
  data!: IOptionData;
  constructor(private element: ElementRef) { }
  ngAfterViewInit(): void {
    this.content = this.element?.nativeElement?.innerHTML;
    this.text = this.content.toString();
  }

}
