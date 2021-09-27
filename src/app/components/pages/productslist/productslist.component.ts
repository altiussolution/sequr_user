import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productslist',
  templateUrl: './productslist.component.html',
  styleUrls: ['./productslist.component.scss']
})
export class ProductslistComponent implements OnInit {
  kit: any=[];
  page = 0;
  size = 4;
  data: any;
  kitdata: any=[];
  item: any=[];
  bin: any=[];
  compartment: any=[];
  cube: any=[];
  constructor(public crud:CrudService,private toast: ToastrService) { }

  ngOnInit(): void {
    this.crud.get(appModels.KITTINGLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.kit =res.data
       for(let i=0;i<this.kit.length;i++){
        this.kitdata=this.kit[i]?.kit_data

     }
     for(let i=0;i<this.kitdata.length;i++){
      this.item=this.kitdata[i]?.item
      this.bin=this.kitdata[i]?.bin
      this.compartment=this.kitdata[i]?.compartment
      this.cube=this.kitdata[i]?.bin
     }
    })
  }
  addkitcart(_id:any) {
    this.crud.post(appModels.ADDKITCART + _id).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      if (res != "") {
        if(res['message']=="Successfully added into cart!"){
          this.toast.success("cart added successfully")
        }
       }
    },error=>{
      this.toast.error("cart added Unsuccessfully")
    })
  }
  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.data = this.kit.filter(() => {
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
  ngOnDestroy(){}
}
