import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2.component';

@NgModule({
  declarations: [Select2Component],
  exports: [Select2Component],
  imports: [
    CommonModule
  ]
})
export class Select2Module { }
