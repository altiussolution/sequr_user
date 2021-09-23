import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  opened: boolean;
  public sidebarToggled = false;
  category:any=[]
  myTextVal:any=[];
  message:any;

 constructor(public router: Router,public crud:CrudService) {}
 ngOnInit(): void {
this.crud.CurrentMessage.subscribe(message=>this.message=message)
  this.crud.get(appModels.CATEGORYLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
    console.log(res)
   this.category=res['data']
  })
this.crud.changemessage("hi")
  }
setval(val){
  this.router.navigate(['pages/home'])
  this.crud.changemessage(val)
}

  logout(){
    if (confirm(`Are you sure, you want to logout?`)) {
    // localStorage.clear();
    this.router.navigate(['./login']);
    // this.toast.success("Logout Successfully")
    }
}

toggleSidebar() {
  let assidebar = document.querySelector('.sidenav');
  let body = document.querySelector('body');
  
  console.log(assidebar);
 
    this.sidebarToggled = !this.sidebarToggled;
    console.log(this.sidebarToggled );
    // debugger
    if(window.innerWidth  < 600){
      if(assidebar.classList.contains('sidebar' || '' ))    
      {
        assidebar.classList.add('sidebar-hidden');
          body.classList.remove('activemenu');
          assidebar.classList.remove('sidebar');
      }
      else
      { 
        assidebar.classList.remove('sidebar-hidden');
        body.classList.add('activemenu');
        assidebar.classList.add('sidebar');
      
      }
    }
else{
if(this.sidebarToggled) {
  assidebar.classList.add('sidebar-hidden');
  body.classList.add('activemenu');
  assidebar.classList.remove('sidebar');
} 
else {
  assidebar.classList.remove('sidebar-hidden');
  body.classList.remove('activemenu');
  assidebar.classList.add('sidebar');
}
}  
}
selectcategory(id:any){

}
ngOnDestroy(){

}
}
