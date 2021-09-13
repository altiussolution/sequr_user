import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageComponent } from './page.component';
import { ShellModule } from '../shell/shell.module';


@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    PageRoutingModule,
    ShellModule
  ]
})
export class PageModule { }
