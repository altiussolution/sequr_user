import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs/operators';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { CookieService } from 'ngx-cookie-service'
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
  machinedetails: any=[];
  val: any=[];

  constructor(private crudService: CrudService, private toast: ToastrService,public cookie: CookieService) { }

  ngOnInit(): void {

    this.getCartItems();
  }
  getCartItems() {
    this.cartList=[];
    this.crudService.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.cartdata=res[0]
    for(let i=0;i< this.cartdata?.cart?.length;i++){
        if( this.cartdata?.cart[i]['cart_status']==1 || this.cartdata?.cart[i]['cart_status']==2){
        this.cartList.push(this.cartdata?.cart[i])
        }
    }
  localStorage.setItem("cartcount",this.cartList?.length)

      this.crudService.getcarttotal(this.cartList?.length)
    }, error => {
      this.toast.error(error.message);
    })
  }

  updateCart(cart, qty) {
    console.log(qty)
    let data = {
      "item": cart.item._id,
      "allocation": cart.allocation,
      "qty": qty,
      "cart_id": this.cartdata['_id']
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
        "cart_id": this.cartdata['_id'],
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
          "cart_id": this.cartdata['_id'],
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

  machineResponse;

  async machineAccess(val){
    console.log(val);
    var result = groupBy(val, function(item) {
      return [item.cube_id, item.bin_name]
    })

    function groupBy(array, f){
      let groups = {};
      array.forEach(element => {
        var group = JSON.stringify(f(element));
        groups[group] = groups[group] || [];
        groups[group].push(element)
      });
      return Object.keys(groups).map(function (group) {
        return groups[group]
      })
    }
    var x = 0
    var loop_break = false;
    setInterval(() => {    
    for(let val of result){
      result[x].sort(function(a, b) { 
        return b.compartment_name - a.compartment_name;
      });
      this.crudService.post(`${appModels.TAKENOW}/machineAccess`,result[x][0]).pipe(delay(5000)).subscribe(async (res) => {
        console.log(res.details.singledevinfo.column[0].status[0]);
       if(res.details.singledevinfo.column[0].status[0] == "Locked"){ 
         console.log(Date, 'if 1')
        this.crudService.post(`${appModels.TAKENOW}/unLockMachine`,result[x][0]).pipe(delay(5000)).subscribe(async (res) => {
          if(res.details.unlock.reply[0] == 'NoError'){
            this.toast.success('Machine Unlocked');
          }else if(res.details.Error.request[0] == 'unlock' && res.details.Error.message[0] == 'Busy'){
            this.toast.success('Machine Unlock is in progress and busy');
          }
        })
       }else if(res.details.singledevinfo.column[0].status[0] == "Unlocked"){
        console.log(Date, 'if 2')
        this.toast.success('Machine Unlocked Open and take your products');
         
       }else if(res.details.singledevinfo.column[0].status[0] == "Closed"){
        this.crudService.post(`${appModels.TAKENOW}/lockMachine`,result[x][0]).pipe(delay(5000)).subscribe(async (res) => {
          if(res.details.unlock.reply[0] == 'NoError'){
            loop_break = true;
            this.toast.success('Machine Locked');  
          }
        })
      }
      })
      if(loop_break){
        x++; // for testing
      }
    }
  }, 10000)
  }

  take(){ 
    this.machinedetails=[];
    this.val=[];
    for(let cart of this.cartList){
      let data={item_name : cart.item.item_name,cube_id : cart.allocation.cube.cube_id, bin_name : cart.allocation.bin.bin_name, compartment_name : cart.allocation.compartment.compartment_name}
      this.val.push(data)
      if(this.cartList.length == this.val.length){
        this.machineAccess(this.val)
      }
    }
  }
}


