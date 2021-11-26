import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
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
  routername: any;
  data: any=[];
  page = 0;
  size = 4;
  permissions : any=[];
  machine: any=[];
  qty: any;
  constructor(public crud:CrudService,public router:Router,private toast: ToastrService) {
    
   }

  ngOnInit(): void {
    this.permissions=JSON.parse(localStorage.getItem("personal"))
    
    this.crud.CurrentMessage2.subscribe(message=>{
      if(message !=""){
        this.routername=message
        localStorage.setItem("routename",this.routername)
      }else{
        this.routername=localStorage.getItem("routename")
      }
    })
   this.crud.CurrentMessage1.subscribe(message=>{
     console.log(message)
    if(message !="" && !localStorage.getItem("allow1")){
      let params: any = {};
params['company_id']=this.permissions?.company_id?._id
          this.product=JSON.parse(message)
          localStorage.setItem("subid",JSON.stringify(this.product))
          console.log(this.product)
          this.crud.get1('item/getItemByCategory/'+this.product['category_id']+'/'+this.product['_id'],{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
          localStorage.setItem("allow1","data")
          console.log(res)
          this.items=res['data']
          this.getData({pageIndex: this.page, pageSize: this.size});
          })
      }else{
        let params: any = {};
        params['company_id']=this.permissions?.company_id?._id
        this.product=JSON.parse(localStorage.getItem("subid"))
        this.crud.get1('item/getItemByCategory/'+this.product?.category_id+'/'+this.product?._id,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
        localStorage.setItem("allow1","data")
        console.log(res)
        this.items=res['data']
        this.getData({pageIndex: this.page, pageSize: this.size});
        })
      }
    
    })
  }
  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

        this.data = this.items.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
        });
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
    this.crud.changemessage3(id)
    localStorage.setItem('ids',id)
    localStorage.removeItem("hlo")
   // localStorage.setItem("_id",id)
    this.router.navigate(['pages/details'])
  }
  addtocart(it: any, qty: number) {
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    this.crud.get1(appModels.DETAILS + it,{params}).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.machine=[];
      this.machine = res.machine
      this.qty = this.machine.quantity
      if(this.qty>=qty){

        let cart = {
          "item" : it,
          "total_quantity" : Number(qty),
          
      }
      console.log(cart)
      this.crud.post(appModels.ADDTOCART,cart).pipe(untilDestroyed(this)).subscribe((res:any) => {
        console.log(res)
        if (res != "") {
          if(res['message']=="Successfully added into cart!"){
            this.toast.success("cart added successfully")
              this.router.navigate(['pages/mycart'])
            // this.router.navigate(['pages/mycart'])
          }else if(res['message']=="Stock Not Yet Allocated"){
            this.toast.error(res['message'])
          }
         }
      },error=>{
        this.toast.error("cart added Unsuccessfully")
      })
      }else{
        this.toast.error("You have exceeded maximum quantity")
      }
    })

  }
  ngOnDestroy(){
    localStorage.removeItem("allow")
  }
  clicktitle(){
    this.router.navigate(['pages/home'])
  }
}
