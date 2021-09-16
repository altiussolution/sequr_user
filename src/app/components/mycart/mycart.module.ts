import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MycartRoutingModule } from './mycart-routing.module';
import { MycartComponent } from './mycart.component';


@NgModule({
  declarations: [MycartComponent],
  imports: [
    CommonModule,
    MycartRoutingModule
  ]
})
export class MycartModule { }
