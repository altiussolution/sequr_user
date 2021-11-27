
import { Component, OnInit, EventEmitter, Input, Output, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { ToastrService } from 'ngx-toastr';

import { MatPaginatorIntl } from '@angular/material/paginator';
declare var google
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
  d: any=[];

  coloumid: any=[];
  coloumids: any=[];
  permissions : any=[];
  coloumidss: any=[];

  constructor(public crud:CrudService,public router:Router,public fb:FormBuilder,private toast: ToastrService) { 
    this.permissions=JSON.parse(localStorage.getItem("personal"))

  }

  ngOnInit() {
    this.coloumidss = localStorage.getItem('coloumid')
    this.home();

  }

home(){
  this.profiledetails = JSON.parse(localStorage.getItem('personal'))
  console.log(this.profiledetails)

  let params: any = {};
params['company_id']=this.profiledetails?.company_id?._id

console.log(this.profiledetails?.company_id?._id,this.coloumidss)
   
   if(this.coloumidss !=""){


   this.crud.CurrentMessage.subscribe(message=>{

    if(message !="" && !localStorage.getItem("allow")){
    console.log(message)
      this.message=JSON.parse(message)
     if(this.message?.length !=0){
      this.categoryName=this.message?.category_name
      this.d=JSON.stringify(this.coloumidss)

      let params: any = {};
        params['column_ids'] = this.d ;
        params['company_id']=this.profiledetails?.company_id?._id
        params['category_id']=this.message?._id

      this.categoryName=this.message?.category_name
      console.log("id",this.categoryName)

      localStorage.setItem("catname",this.message?.category_name)
      localStorage.setItem("catid",this.message?._id)

      this.crud.get1(appModels.SUBCATEGORY,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
        localStorage.setItem("allow","data")
        console.log(res)
     
        this.subcategories=res['data']
        
        this.getData({pageIndex: this.page, pageSize: this.size});
      })
     }
 
    
    }else{
      this.categoryName=localStorage.getItem("catname")

      this.d=JSON.stringify(this.coloumidss)
      console.log(this.d)
      let params: any = {};
      params['company_id']=this.profiledetails?.company_id?._id
        params['column_ids'] = this.d ;
        params['category_id']=localStorage.getItem("catid")

        console.log(params)
      this.crud.get1(appModels.SUBCATEGORY,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
        localStorage.setItem("allow","data")
        console.log(res)
     
        this.subcategories=res['data']
        
        this.getData({pageIndex: this.page, pageSize: this.size});
 
      })
    }
  
  })
 }


console.log(localStorage.getItem("lan"))
  console.log(this.readCookie('googtrans'));
   
if(!localStorage.getItem("language")){
  setTimeout(() => {
    localStorage.setItem("language","lang")
    this.setCookie("googtrans",localStorage.getItem("lan") );
   window.location.reload()
  }, 3000);

 }
}

setCookie(name,value,) {
  document.cookie = name + "=" + value;

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
    console.log(this.data)
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

