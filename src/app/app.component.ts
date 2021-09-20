import { Component, OnInit,OnChanges,SimpleChanges,Inject,Input} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent   {
  opened: boolean;
  public sidebarToggled = false;
  title = 'sequr-user';

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
}
