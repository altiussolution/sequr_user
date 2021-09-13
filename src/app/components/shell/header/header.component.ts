import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 constructor(public router: Router) {}
 ngOnInit(): void {
    
  }
  logout(){
    if (confirm(`Are you sure, you want to logout?`)) {
    // localStorage.clear();
    this.router.navigate(['./login']);
    // this.toast.success("Logout Successfully")
    }
}
}
