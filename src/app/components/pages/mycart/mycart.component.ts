import { Component, OnInit } from '@angular/core';
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
  cartList: any[] = [];


  constructor(private crudService: CrudService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getCartItems();
  }
  getCartItems() {
    this.crudService.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.cartDetails = res[0];
      this.cartList = res[0].cart;
    }, error => {
      this.toast.error(error.message);
    })
  }

  updateCart(cart, qty) {
    console.log(qty)
    let data = {
      "item": cart.item._id,
      "allocation": cart.allocation,
      qty: qty
    }
    this.crudService.update(appModels.updateCart, data, this.cartDetails['_id']).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.toast.success(res.message);
    }, error => {
      this.toast.error(error.message);
    })
  }

  ngOnDestroy() { }

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
