/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Module */
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

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

/** Custom Material Module */
/** Shell Module */

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ShellComponent,
    MenuComponent
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
    ],
  exports: [HeaderComponent,FooterComponent,MenuComponent,ShellComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    
  ],
})
export class ShellModule { }
