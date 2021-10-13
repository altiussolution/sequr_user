import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomeComponent } from './home.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MatSelectModule,

  ]
})
export class HomeModule { }
