/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from "../../services/core/shell.service";
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { ItemhistoryComponent } from './itemhistory/itemhistory.component';
import { MycartComponent } from './mycart/mycart.component';
import { ProductsComponent } from './products/products.component';
import { ProductslistComponent } from './productslist/productslist.component';
import { ProfileComponent } from './profile/profile.component';

/** Customer Routes */
const routes: Routes = [
  Shell.childRoutes([
    {path : "",redirectTo:'home',pathMatch:"full"},
    { path: 'home',component:HomeComponent },
    { path: 'products', component:ProductsComponent},
    { path: 'productslist' ,component:ProductslistComponent},
    { path: 'details', component:DetailsComponent },
    { path: 'mycart',component:MycartComponent },
    { path: 'itemhistory',component:ItemhistoryComponent},
    { path: 'profile', component:ProfileComponent }
    ])
  

];


/** Customer Routing Module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
