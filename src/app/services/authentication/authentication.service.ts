import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }
  post(model: string, params?: any): Observable<any> {
    return this.http.post(model, params);
  }
 
}

