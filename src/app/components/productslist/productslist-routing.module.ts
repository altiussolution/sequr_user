import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductslistComponent } from './productslist.component';

const routes: Routes = [{ path: '', component: ProductslistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductslistRoutingModule { }
