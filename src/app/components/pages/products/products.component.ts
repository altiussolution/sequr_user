import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  product: any=[];
  items: any=[];
  message: any=[];
 
  constructor(public crud:CrudService,public router:Router) { }

  ngOnInit(): void {
   this.crud.CurrentMessage1.subscribe(message=>{
    if(message !=""){
        this.product=JSON.parse(message)
        console.log(this.product)
       
      this.crud.get('item/getItemByCategory/'+this.product.category_id+'/'+this.product._id).pipe(untilDestroyed(this)).subscribe((res:any) => {
        console.log(res)
       this.items=res['data']
      })
      }

  })
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
  select(id:any){
    localStorage.setItem("id",id)
    this.router.navigate(['pages/details'])
  }

  ngOnDestroy(){}
}
