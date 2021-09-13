import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public router: Router,) { }

  ngOnInit(): void {
  }
  dashboard(){
    this.router.navigate(["pages/dashboard"])
      }
      maintanence(){
        this.router.navigate(["pages/maintanence"])
      }
      manage(){
        this.router.navigate(["pages/manage"])
      }
      analytics(){
        this.router.navigate(["pages/analytics"])
      }
      Report(){
        this.router.navigate(["pages/report"])
      }
      PurchaseOrder(){
        this.router.navigate(["pages/purchase-order"])
      }
      logs(){
        this.router.navigate(["pages/logs"])
      }
      employee(){
        this.router.navigate(["pages/employee"])
        console.log("clicked")
      }
      
}
