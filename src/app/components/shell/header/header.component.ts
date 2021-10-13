import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input , Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { CookieService } from 'ngx-cookie-service'

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
  category1: any=[];
  subcategory: any=[];
  searchIcon = 'search-icon';
  cartDetails: any=[];
  itemhistorykit: any=[];
  selectedItem: any;
  cartList: any=[];
  cartdata: any=[];
  item: any=[];
  name: any=[];
  cartListlength: any;
  

 constructor(public router: Router,public crud:CrudService,private cookie: CookieService) {

 }

 
 cart(){
   let data;
  return data=localStorage.getItem("cartcount");
}
 ngOnInit(): void {
  // var intervalId = window.setInterval(, 5000);
  // setInterval(()=> { this.function1() },5000);
  this.cartList=[];
  this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
    console.log(res)
    this.cartdata=res[0]
  for(let i=0;i< this.cartdata?.cart?.length;i++){
      if( this.cartdata?.cart[i]['cart_status']==1 || this.cartdata?.cart[i]['cart_status']==2){
      this.cartList.push(this.cartdata?.cart[i])
      this.cartListlength=this.cartList.length
       }}
             localStorage.setItem("cartcount",this.cartList?.length)
      })

// this.getCartTotal()
this.crud.currentTotal.subscribe((message:any)=>{this.cartListlength=message
})
  this.crud.get(appModels.CATEGORYLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
    console.log(res)
   this.category=res['data']
   localStorage.removeItem("allow") 
   this.crud.changemessage(JSON.stringify(this.category[0]))
   this.selectedItem = this.category[0];
  })
  this.crud.get(appModels.ITEMLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
    console.log(res)
    this.itemhistorykit=res['Kits']
  })
 
  
  }
setval(val:any){
  localStorage.removeItem("allow") 
  this.crud.changemessage(JSON.stringify(val))
  this.router.navigate(['pages/home'])
  this.selectedItem = val;
}

  logout(){ 
    localStorage.clear();
    this.router.navigate(['./login']);
}
@ViewChild('searchInput', { read: ElementRef })
private searchInput: ElementRef;

  interactedWithSearch = false;
  @Output()
  searchEvent = new EventEmitter<{ query?: string, action: 'SEARCH' | 'CLEAR' }>();

  toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    this.toggleClass(searchContainer, 'open');
   
    if (!this.hasClass(searchContainer, 'open') && this.interactedWithSearch) {
      this.searchEvent.emit({ action: 'CLEAR' });
      this.interactedWithSearch = false;
      this.searchInput.nativeElement.value = '';
    }
  }

  private toggleClass(elem, className) {
    this.hasClass(elem, className) ? elem.classList.remove(className) : elem.classList.add(className);
  }

  private hasClass(elem, className): boolean {
    return elem.classList.contains(className);
  }

  search() {
    const searchTerm = this.searchInput.nativeElement.value;
    this.searchEvent.emit({ query: searchTerm, action: 'SEARCH' });
    this.interactedWithSearch = true;
    this.crud.get(appModels.ITEM).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log("oi",res)
      this.item=res.item
      for (let i = 0; i < this.item.length; i++) {
        this.name=this.item[i]?.item_name
        console.log(this.name)  
      }
      
    })
  }
  getitem(value){
    console.log(value)
  }
//  ngOnInit(): void {
    
//   }
test(){
  let assidebar = document.querySelector('.sidenav');
  let body = document.querySelector('body');
  if(assidebar.classList.contains('sidenav'))    
      {
        assidebar.classList.add('sidebar-hidden');
        body.classList.add('activemenu');
        assidebar.classList.add('sidebar');
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
selectcategory(val:any,category:any){
    localStorage.removeItem("allow1") 
    this.category1=category
    this.subcategory=val
    let data=this.category1.category.category_name+">"+this.subcategory?.sub_category_name
    this.crud.changemessage2(data)
    this.crud.changemessage1(JSON.stringify(val))
  
  this.router.navigate(['/pages/products'])
  

}

getCartTotal() {
  this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
    console.log(res)
    this.cartDetails = res[0]?.length;
    this.crud.currentTotal.subscribe(cart => this.cartDetails = cart)
  })
}
ngOnDestroy(){

}
}
