
import { Component, OnInit, EventEmitter, Input, Output, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
  categoryName: any=[];
  subcategories1: any=[];


  subcategories: any=[];
  data: any=[];
  selectdata:any=[];
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
  categoryid: string;
  item: any=[];
  unsub: Subscription;
category: any=[];
selectcat:any=[];
  constructor(public crud:CrudService,public router:Router,public fb:FormBuilder,private toast: ToastrService) { 
    this.permissions=JSON.parse(localStorage.getItem("personal"))

  }

  ngOnInit() {
    // this.categoryName=localStorage.getItem("categname")
    this.coloumidss = localStorage.getItem('coloumid')
    this.home();

  }

home(){
  this.profiledetails = JSON.parse(localStorage.getItem('personal'))

   
   if(this.coloumidss !=""){

   this.crud.CurrentMessage.subscribe(message=>{

    if(message !="" ){  
    console.log(message)
    this.subcategories=[]
      this.message=JSON.parse(message)
     if(this.message?.length !=0){
      let params: any = {};
      this.categoryName=this.message['category']['category_name']
      localStorage.setItem("catname",this.message['category']['category_name'])
      localStorage.setItem("catid",this.message['category']['_id'])
      params['column_ids'] = this.coloumidss;
      params["category_id"] = this.message['category']['_id'];
      params['company_id'] = this.profiledetails?.company_id?._id
      this.crud.get1(appModels.SUBCATEGORY,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
        localStorage.setItem("allow","data")
     
        console.log(res)
     if(res){
      this.subcategories=res['data']
        
      this.getData({pageIndex: this.page, pageSize: this.size},this.subcategories);
     }
      
 
      })
      //  this.selectcat=this.message
       console.log(this.selectcat)
      //  localStorage.setItem("categoryid",JSON.stringify(this.subcategories))
      //  this.subcategories=this.message
     

     
     }
 
    
    }
//     else{
//        this.subcategories=[]
  
// if(localStorage.getItem("coloumid")){
  
//   let params: any = {};
//   params['company_id'] = this.profiledetails?.company_id?._id
 
//   params['column_ids'] = this.coloumidss;
//   this.crud.get1(appModels.CATEGORYLIST, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
//     console.log(res)
  
//     this.category = res['data']
//     this.categoryName=this.category[0].category_name
//     let params: any = {};
//   params['column_ids'] = this.coloumidss;
//     params["category_id"] = this.category[0]._id;
//     params['company_id'] = this.profiledetails?.company_id?._id
//     this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
//       console.log(res)
//       this.subcategories = res['data']
//       this.getData({pageIndex: this.page, pageSize: this.size});
//     })
//   })
// }else {
//   alert("no col id")
// }

      
//     }
  
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
 
  getData(obj,data) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.data = data.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log(this.data)
  }
  

selectcategory(val:any){
  console.log(val)
    localStorage.removeItem("allow1")
    this.categoryid=localStorage.getItem("categid")

  this.subcategories1=val
  let data1={
    "category_id": val.category_id._id,
    "_id":this.subcategories1._id
  }

  let data=val.category_id.category_name+">"+this.subcategories1?.sub_category_name
  this.crud.changemessage2(data)
  this.crud.changemessage1(JSON.stringify(data1))
  this.router.navigate(['/pages/products'])

  // let params: any = {};
  // params['column_ids'] = this.d;
  // params['category_id']=this.categoryid
  // params['sub_category_id']=this.subcategories1?._id
  // this.crud.get1(appModels.ITEMS,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
  //    this.item=[res.data]
  //    console.log(this.item)
  //    this.router.navigate(['/pages/products',{ data: this.item }] )
  // })

 
}
ngOnDestroy(){
 this.unsub = this.crud.CurrentMessage.subscribe(res=>{

 })
 this.unsub.unsubscribe();
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

