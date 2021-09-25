import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.scss']
})
export class MycartComponent implements OnInit {

  cartDetails: any[] = [];

  constructor(private crudService: CrudService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getCartItems();
  }
  getCartItems() {
    this.crudService.get('cart/myCart').pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.cartDetails = res[0].cart;
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
