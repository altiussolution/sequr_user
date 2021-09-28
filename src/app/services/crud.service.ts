import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";

import {  BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudService {

private messagesource= new BehaviorSubject<any>("");
private messagesource1= new BehaviorSubject<any>("");
private messagesource2= new BehaviorSubject<any>("");
CurrentMessage= this.messagesource.asObservable();
CurrentMessage1= this.messagesource1.asObservable();
CurrentMessage2= this.messagesource2.asObservable();

private cartTotal = new BehaviorSubject<any>("");
currentTotal = this.cartTotal.asObservable();

  constructor(private http: HttpClient) { }

changemessage(message:any){
  this.messagesource.next(message)
}
changemessage1(message:any){
  this.messagesource1.next(message)
}
changemessage2(message:any){
  this.messagesource2.next(message)
}
getCartTotal(total: any) {
  this.cartTotal.next(total);
}
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
  update2(model: string, body: any): Observable<any> {
    return this.http.put(`${model}`, body);
  }

}
















