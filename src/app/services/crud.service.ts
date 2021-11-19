import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import {  BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CrudService {

private messagesource= new BehaviorSubject<any>("");
private messagesource1= new BehaviorSubject<any>("");
private messagesource2= new BehaviorSubject<any>("");
private messagesource3= new BehaviorSubject<any>("");

CurrentMessage= this.messagesource.asObservable();
CurrentMessage1= this.messagesource1.asObservable();
CurrentMessage2= this.messagesource2.asObservable();
CurrentMessage3= this.messagesource3.asObservable();


 constructor(private http: HttpClient) {




  }
  public cartTotal = new Subject
  // private cartTotal = new BehaviorSubject<any>("");

  getProducts(): Observable<any> {
    let existingCartItems = JSON?.parse(localStorage.getItem('products'));
    this.cartTotal.next(existingCartItems);
    if (!existingCartItems) {
      existingCartItems = 0;
    }
    console.log("localstorage",existingCartItems)
    return this.cartTotal.asObservable();
  }
changemessage(message:any){
  this.messagesource.next(message)
}
changemessage1(message:any){
  this.messagesource1.next(message)
}
changemessage2(message:any){
  this.messagesource2.next(message)
}
changemessage3(message:any){
  this.messagesource3.next(message)
}
getcarttotal(cart:any) {
  console.log(cart,"carttotal")
  localStorage.setItem('products', JSON.stringify(cart));
  this.cartTotal.next(cart);
 
}
  get(model: string): Observable<any> {
    return this.http.get(model);
  }
  get1(model: string, params:any): Observable<any> {
    return this.http.get(model,params);
  }
  get2(model: string, params:any): Observable<any> {
    return this.http.get(`${model}/${params}`);
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
















