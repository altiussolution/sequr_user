import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.scss']
})
export class MycartComponent implements OnInit {

  cartDetails: any[] = [];
  cartList: any=[];
  cartIds: any[] = [];
  selected3: any[] = [];
  page = 0;
  size = 4;
  cartdata: any=[];

  constructor(private crudService: CrudService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getCartItems();
  }
  getCartItems() {
    this.crudService.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.cartdata=res[0]
    for(let i=0;i< this.cartdata?.cart?.length;i++){
        if( this.cartdata?.cart[i]['cart_status']==1 || this.cartdata?.cart[i]['cart_status']==2){
        this.cartList.push(this.cartdata?.cart[i])
        }
    }
      this.cartDetails = res[0];
      this.crudService.getcarttotal(this.cartDetails)
    }, error => {
      this.toast.error(error.message);
    })
  }

  updateCart(cart, qty) {
//     "cart_id" : "61545519f7654233891d3da4",
// "qty" : 19,
// "item" : "614adb1a7ba6c0c391f71cbc",
// "allocation":"614adbdf7ba6c0c391f71cc5"
    console.log(qty)
    let data = {
      "item": cart.item._id,
      "allocation": cart.allocation,
      "qty": qty,
      "cart_id": [this.cartDetails['_id']]
    }
    this.crudService.update2(appModels.updateCart, data).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.toast.success(res.message);
      this.getCartItems();
    }, error => {
      this.toast.error(error.message);
    })
  }

  deleteCart(cart) {
    if (confirm(`Are you sure, you want to Delete?`)) {
      let data = {
        "cart_id": this.cartDetails['_id'],
        "item_id": [cart.item._id],
      }
      this.crudService.update2('cart/deleteItemFromCart', data).pipe(untilDestroyed(this)).subscribe(res => {
        console.log(res)
        this.toast.success(res.message);
        this.getCartItems();
      }, error => {
        this.toast.error(error.message);
      })
    }
  }


  deleteMultiple() {
    if (this.selected3.length === 0) {
      this.toast.warning('Please select a product')
    } else {
      if (confirm(`Are you sure, you want to Delete?`)) {
        let data = {
          "cart_id": this.cartDetails['_id'],
          "item_id": this.selected3,
        }
        this.crudService.update2('cart/deleteItemFromCart', data).pipe(untilDestroyed(this)).subscribe(res => {
          console.log(res)
          this.toast.success(res.message);
          this.getCartItems();
          this.selected3 = [];
        }, error => {
          this.toast.error(error.message);
        })
      }
    }
  }

  ngOnDestroy() { }
  

  toggle(cart, event: MatCheckboxChange) {
    if (event.checked) {
      this.selected3.push(cart.item._id);
    } else {
      const index = this.selected3.indexOf(cart.item._id);
      if (index >= 0) {
        this.selected3.splice(index, 1);
      }
    }
    console.log(cart.item._id , event.checked);
  }

  exists(cart) {
    return this.selected3.indexOf(cart.item._id) > -1;
  };

  isIndeterminate() {
    return (this.selected3.length > 0 && !this.isChecked());
  };

  isChecked() {
    return this.selected3.length === this.cartList?.length;
  };


  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.cartList.forEach(cart => {
        this.selected3.push(cart.item._id)
      });
    } else {
      this.selected3.length = 0;
    }
  }

  listview() {

    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');
    asgrid.classList.add('as-list')
    asgridg.classList.remove('view-active')
    asgridl.classList.add('view-active')

  }
  gridview() {

    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');

    asgrid.classList.remove('as-list')
    asgridg.classList.add('view-active')
    asgridl.classList.remove('view-active')
  }
}


