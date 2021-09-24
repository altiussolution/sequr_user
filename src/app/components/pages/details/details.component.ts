import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  items: any=[];
  machine: any=[];
  cube: any=[];
  bin: any=[];
  compartment: any=[];
  it: any;
  qty: any;
  qtyform!: FormGroup;
  id: any;

  constructor(  public router: Router,private toast: ToastrService, private fb: FormBuilder,public crud:CrudService) { 
      this.qtyform = this.fb.group({
        qty: [""]
      })
    }

  ngOnInit(): void {
  console.log(localStorage.getItem("id"))
    this.crud.get(appModels.DETAILS +localStorage.getItem("id")).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.items=res.items
      this.machine=res.machine
      this.it=this.machine.item
      this.qty=this.machine.quantity
      console.log(this.it)
      this.cube=this.machine.cube
      this.bin=this.machine.bin
      this.compartment=this.machine.compartment
  })
}
changing(value: any) {
  console.log(value)
  this.qty = this.qtyform.get(['qty'])?.value

}

  addtocart(it: any, qty: any) {
    let cart = {
        "item" : it,
        "total_quantity" : this.qty,
        "cart_status" : 1    
    }
    this.crud.post(appModels.ADDTOCART,cart).subscribe(res => {
      console.log(res)
      if (res != "") {
        this.toast.success("cart added successfully")
      }
    })
  }
//addtocard(){
 // this.router.navigate(['/pages/mycart']);

//}
ngOnDestroy(){}
}
