
import { Component, OnInit, EventEmitter, Input, Output, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

declare var google
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 
  message: any=[];
  categoryName: any;
  subcategories1: any=[];


  subcategories: any=[];
  data: any=[];
  page = 0;
  size = 4;
  selectedValue: any;
  selectedGroup: any;
  profiledetails: any=[];
  constructor(public crud:CrudService,public router:Router,public fb:FormBuilder) { 
 
  }

  ngOnInit() {
  console.log(this.readCookie('googtrans'));
  if(!localStorage.getItem("language")){
    // if (confirm(`Language has been updated for you please refresh the page.`)) {
   localStorage.setItem("language","lang")
    window.location.reload()
    
  }


    this.crud.CurrentMessage.subscribe(message=>{

      if(message !="" && !localStorage.getItem("allow")){
      
        this.message=JSON.parse(message)
        this.categoryName=this.message?.category?.category_name
        
        this.crud.get(appModels.SUBCATEGORY+this.message?.category?._id).pipe(untilDestroyed(this)).subscribe((res:any) => {
          localStorage.setItem("allow","data")
          console.log(res)
          this.subcategories=res['data']
          
          this.getData({pageIndex: this.page, pageSize: this.size});
        })
      }
     
    })
  }



   readCookie(name) {
     console.log(document.cookie)
    var c = document.cookie.split('; '),
    cookies = {}, i, C;

    for (i = c.length - 1; i >= 0; i--) {
        C = c[i].split('=');
        cookies[C[0]] = C[1];
     }

     return cookies[name];
}
 
  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.data = this.subcategories.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
selectcategory(val:any){
    localStorage.removeItem("allow1")
  this.subcategories1=val
  let data1={
    "category_id": this.subcategories1?.category_id?._id,
    "_id":this.subcategories1._id
  }
  let data=this.categoryName+">"+this.subcategories1?.sub_category_name
  this.crud.changemessage2(data)
  this.crud.changemessage1(JSON.stringify(data1))
  this.router.navigate(['/pages/products'])
}
ngOnDestroy(){

}
  
  listview(){
    
    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');
    asgrid.classList.add('as-list')
    asgridg.classList.remove('view-active')
    asgridl.classList.add('view-active')
    
  }
  gridview(){
    
    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');
   
    asgrid.classList.remove('as-list')
    asgridg.classList.add('view-active')
    asgridl.classList.remove('view-active')
  }
}
