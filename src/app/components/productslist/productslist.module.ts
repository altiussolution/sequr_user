import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductslistRoutingModule } from './productslist-routing.module';
import { ProductslistComponent } from './productslist.component';


@NgModule({
  declarations: [ProductslistComponent],
  imports: [
    CommonModule,
    ProductslistRoutingModule
  ]
})
export class ProductslistModule { }
