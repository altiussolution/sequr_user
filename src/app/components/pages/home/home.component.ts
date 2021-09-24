
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subcategories: any=[];
  message: any;
  categoryName: any;
  subcategories1: any=[];
  constructor(public crud:CrudService,public router:Router) { }

  ngOnInit(): void {
    this.crud.CurrentMessage.subscribe(message=>{

      if(message !=""){
        this.message=JSON.parse(message)
         this.method();
      }
     
    })
  }
  method(){
    this.categoryName=this.message?.category?.category_name
    this.crud.get(appModels.SUBCATEGORY+this.message?.category?._id).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.subcategories=res['data']
    })
  }
selectcategory(val:any){
  this.subcategories1=val
  let data=this.categoryName+">"+this.subcategories1?.sub_category_name
  this.crud.changemessage2(data)
  this.crud.changemessage1(JSON.stringify(val))
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
