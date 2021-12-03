/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Module */
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
//import { NgxSpinnerModule } from "ngx-spinner/ngx-spinner";

/** Custom Material Module */
/** Shell Module */

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ShellComponent,
    MenuComponent,
    
  ],

  imports: [
    MatSortModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    NgxImageZoomModule,
    AutocompleteLibModule,
   // NgxSpinnerModule,

    ],
  exports: [HeaderComponent,FooterComponent,MenuComponent,ShellComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    NgxImageZoomModule,
    MatSortModule,
    MatCardModule,
    AutocompleteLibModule,
   // NgxSpinnerModule,

  ],
})
export class ShellModule { }
