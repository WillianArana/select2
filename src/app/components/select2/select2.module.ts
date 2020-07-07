import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2.component';
import { Option2Module } from '../option2/option2.module';
import { SafePipe } from 'src/app/pipes/safe.pipe';

const exports = [Select2Component, Option2Module];

@NgModule({
  declarations: [Select2Component, SafePipe],
  exports,
  imports: [
    CommonModule,
    Option2Module
  ]
})
export class Select2Module { }
