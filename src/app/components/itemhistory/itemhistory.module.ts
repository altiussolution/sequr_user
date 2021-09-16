import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemhistoryRoutingModule } from './itemhistory-routing.module';
import { ItemhistoryComponent } from './itemhistory.component';


@NgModule({
  declarations: [ItemhistoryComponent],
  imports: [
    CommonModule,
    ItemhistoryRoutingModule
  ]
})
export class ItemhistoryModule { }
