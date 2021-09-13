import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class CrudService {


  constructor(private http: HttpClient) { }


  get(model: string): Observable<any> {
    return this.http.get(model);
  }
  get1(model: string, params:any): Observable<any> {
    return this.http.get(model,params);
  }
  post(model: string, params?: any): Observable<any> {
    return this.http.post(model, params);
  }

  delete(model: string, id: any): Observable<any> {
    return this.http.delete(`${model}/${id}`);
  }
  delete1(model: string, id?: any): Observable<any> {
    return this.http.put(`${model}/${id}`,{id});
  }
  delete2(model: string, id?: any): Observable<any> {
    return this.http.put(`${model}?id=${id}`,{id});
  }
  update(model: string, body: any, id: any): Observable<any> {
    console.log(model, id)
    return this.http.put(`${model}/${id}`, body);
  }
  update1(model: string, body: any, id: any): Observable<any> {
    console.log(model, id)
    return this.http.put(`${model}?id=${id}`, body);
  }
  
}
















