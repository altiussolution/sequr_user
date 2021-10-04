import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-itemhistory',
  templateUrl: './itemhistory.component.html',
  styleUrls: ['./itemhistory.component.scss']
})
export class ItemhistoryComponent implements OnInit {
  itemhistorycart: any=[];
  itemhistorykit: any=[];
  date: any;
  date1: any;
  arrayvalue:any=[]
  DataForm:FormGroup;
  @ViewChild('closebutton') closebutton;
  arrayvalue1: any=[];
  id: any;
  cartdata: any=[];
  constructor(public crud:CrudService, private toast: ToastrService) { }
  ngOnInit(): void {
  this.arrayvalue1=[];
  this.arrayvalue=[];
  this.crud.get(appModels.ITEMLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.itemhistorycart=[]
      this.cartdata=res['Cart'][0]['cart']
      for(let i=0;i< this.cartdata?.length;i++){
        if( this.cartdata[i]['cart_status']==1 || this.cartdata[i]['cart_status']==2){
        this.itemhistorycart.push(this.cartdata[i])
        }}
      this.id=res['Cart'][0]['_id']
      this.date=res['Cart'][0]['updated_at']
      this.itemhistorykit=res['Kits']
  })
}
  passParams(event:any,val:any){
    if(event.target.checked){
      this.arrayvalue.push(val);
      }
    if (!event.target.checked) {
      let index = this.arrayvalue.indexOf(val);
    if (index > -1) {
      this.arrayvalue.splice(index, 1);
      }
    }
    console.log(this.arrayvalue)
  }
  delete(i:any){
    if (i > -1) {
      this.arrayvalue.splice(i, 1);
      }
  }
  myFunction(event,i){
    console.log(event.target.id)
    if(this.arrayvalue[i].qty>=event.target.value){

    }else{
    (<HTMLInputElement>document.getElementById(event.target.id)).value="";
    }
  }

  close(){
    this.ngOnInit();
  }
  returnproduct(){
    if(this.arrayvalue.length!=0){
    var result = this.arrayvalue.map(function(a) {return a?._id;});
    console.log(this.itemhistorycart["_id"])
    let data={
      "cart_id": this.id,
      "return_items" : result,
      "cart_status" : 3 ,
     
    }
  this.crud.update2(appModels.RETURNCART,data).pipe(untilDestroyed(this)).subscribe((res:any) => {
     this.closebutton.nativeElement.click();
     this.toast.success("Item Returned Successfully")
     this.ngOnInit();
    })
  }else{
    this.toast.error("Please choose any item from list")
    this.closebutton.nativeElement.click();
    this.ngOnInit();
  }
  }
  passParams1(event:any,val:any){
    if(event.target.checked){
      this.arrayvalue1.push(val);
      }
    if (!event.target.checked) {
      let index = this.arrayvalue1.indexOf(val);
    if (index > -1) {
      this.arrayvalue1.splice(index, 1);
      }
    }
    console.log(this.arrayvalue1)
  }
  returnkits(){
    if(this.arrayvalue1.length!=0){
      var kitnames = this.arrayvalue1.map(function(a) {return a?.kit_name;});
      if (confirm(`Are you sure want to Return the Kits for ${kitnames}?`)) {
          var kitids = this.arrayvalue1.map(function(a) {return a?.update_kit_id;});
          var cartid = this.arrayvalue1.map(function(a) {return a?.cart_id;});
          console.log(kitids)
          let data={
            "cart_id":cartid,
          "return_items" : kitids,
          "kit_status" : 3,
          }
    this.crud.update2(appModels.RETURNCART,data).pipe(untilDestroyed(this)).subscribe((res:any) => {
       this.closebutton.nativeElement.click();
       this.toast.success("Kit Returned Successfully")
       this.ngOnInit();
      })
    }else{
      this.ngOnInit();
    }
    }else{
      this.toast.error("Please choose any kit from list")
    }
    
  }
  ngOnDestroy(){}
}
