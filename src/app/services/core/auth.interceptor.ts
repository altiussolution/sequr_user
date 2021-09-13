import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       const currentToken = localStorage.getItem("JWTokens");
        console.log(environment.API_URL)
        let headers: HttpHeaders = new HttpHeaders({
            Authorization: `${currentToken}`
        });
            request = request.clone({
                url: environment.API_URL + request.url,
                headers
            });
        
        return next.handle(request);
    }
}