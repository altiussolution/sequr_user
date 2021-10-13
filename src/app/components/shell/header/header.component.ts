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
  val:any =[];
  searchValue: any=[];
  public codeValue: string;
  id: any;
  cartListlength: any[]=[];
  

 constructor(public router: Router,public crud:CrudService,private cookie: CookieService) {

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
  this.crud.changemessage3(this.id)

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

  /*search(event) {
   // this.val=[]

    this.searchValue=event.target.value
    console.log(this.searchValue)
    let params: any = {};
    if (this.searchValue) {
      params['searchString'] = this.searchValue;
    }
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log("oi",res)
      this.item=res.item
      this.val=this.item[0]._id
      console.log(this.val)
    
      this.crud.get(appModels.DETAILS +this.val).pipe(untilDestroyed(this)).subscribe((res:any) => {
        console.log(res)
        this.router.navigate(['pages/details'])
    
      })
    })
   
    const searchTerm = this.searchInput.nativeElement.value;
    this.searchEvent.emit({ query: searchTerm, action: 'SEARCH' });
    this.interactedWithSearch = true;

  }*/
  public saveCode(e): void {
    let params: any = {};
    if (this.codeValue) {
      params['searchString'] = this.codeValue;
    }
    console.log(this.codeValue)
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.item=res.item
    let find = this.item.find(x => x?.item_name === e.target.value);
    console.log(find?._id);
    this.id=find?._id
    this.crud.changemessage3(this.id)
   // localStorage.setItem("_id",find?._id)
   localStorage.removeItem("hlo")
    this.router.navigate(['pages/details'])
   
  })
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
