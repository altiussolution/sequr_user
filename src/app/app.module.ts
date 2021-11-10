import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './services/core/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import { CookieService } from 'ngx-cookie-service';
import { CrudService } from './services/crud.service';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotpasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    NgxImageZoomModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      tapToDismiss: true
    }), // ToastrModule added
    MatSelectModule,
    AutocompleteLibModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },CookieService,CrudService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
