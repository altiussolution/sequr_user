import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemhistoryComponent } from './itemhistory.component';

const routes: Routes = [{ path: '', component: ItemhistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemhistoryRoutingModule { }
