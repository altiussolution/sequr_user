/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Custom Routing Module */
import { PageRoutingModule } from './page-routing.module';

/** Custom Module */
import { ShellModule } from '../shell/shell.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { ItemhistoryComponent } from './itemhistory/itemhistory.component';
import { MycartComponent } from './mycart/mycart.component';
import { ProductsComponent } from './products/products.component';
import { ProductslistComponent } from './productslist/productslist.component';
import { ProfileComponent } from './profile/profile.component';
import {MatCheckboxModule} from '@angular/material/checkbox';




@NgModule({
  declarations: [
   HomeComponent,
   DetailsComponent,
   ItemhistoryComponent,
   MycartComponent,
   ProductsComponent,
   ProductslistComponent,
   ProfileComponent
  ],
  entryComponents: [


  ],
  imports: [
    CommonModule,
    PageRoutingModule,
    ShellModule,
    FormsModule,
   
    ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule,
    MatRippleModule, MatIconModule, MatSidenavModule, MatSlideToggleModule, MatListModule,
    MatCheckboxModule
  ]
})
export class PageModule { }
