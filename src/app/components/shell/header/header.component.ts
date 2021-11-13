import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Input , Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { CookieService } from 'ngx-cookie-service'
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
   cartProductCount: "";
  profiledetails: any=[];
  profile: any=[];
myform: FormGroup;
   
   keyword = 'item_name';
   states = [
     {
       name: 'Arkansas',
       population: '2.978M',
       flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
      //  ../../../../assets/img/hamer.png
     },
     {
       name: 'California',
       population: '39.14M',
       flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
     },
     {
       name: 'Florida',
       population: '20.27M',
       flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
     },
     {
       name: 'Texas',
       population: '27.47M',
       flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
     }
   ];
  searchdata: any=[];
  typed: any;
  dooropens: any=[];
  dooropenss: any=[];
  @ViewChild('modal') closebutton;

 constructor(public router: Router,public crud:CrudService,private cookie: CookieService,private toast: ToastrService) {

  this.crud.get(appModels.ITEM).pipe(untilDestroyed(this)).subscribe((res:any) => {
    console.log(res)
    this.item=res.item
  })
  this.myform = new FormGroup({
    searchvalue : new FormControl("")
  })
 }

 

 ngOnInit():void {
  this.profiledetails = JSON.parse(localStorage.getItem('personal'))
  console.log(this.profiledetails)
  this.crud.get(appModels.USERPROFILE + this.profiledetails._id).pipe(untilDestroyed(this)).subscribe((res: any) => {
    console.log(res)
    this.profile = res['data']
  })

  this.crud.getProducts().subscribe(data => {
    this.cartProductCount=""
    this.cartProductCount = data;
    console.log(this.cartProductCount)
  })
  this.cartList=[];
  this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
    console.log(res)
    this.cartdata=res[0]
  for(let i=0;i< this.cartdata?.cart?.length;i++){
      if( this.cartdata?.cart[i]['cart_status']==1){
      this.cartList.push(this.cartdata?.cart[i])
      // this.cartListlength=this.cartList.length
       }}
            
             this.crud.getcarttotal(this.cartList?.length)
      })
           
      this.crud.get(appModels.COLOMNIDS).pipe(untilDestroyed(this)).subscribe((res:any) => {
        console.log(res)

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
    this.closebutton.nativeElement.click();
    localStorage.clear();
    this.router.navigate(['./login']);
// this.dooropens=[];
// this.dooropenss=[];
// this.crud.get('machine/wasfullopen').pipe(untilDestroyed(this)).subscribe((res:any) => {
// console.log(res)
// this.dooropens=res?.details?.alldevinfo?.Count
// this.crud.get('machine/isfullopen').pipe(untilDestroyed(this)).subscribe((res:any) => {
//   console.log(res)
//   this.dooropenss=res?.details?.alldevinfo?.Count
// if(this.dooropens.length==0 && this.dooropenss.length==0){
//   this.closebutton.nativeElement.click();
//     localStorage.clear();
//     this.router.navigate(['./login']);
// }else{
//   this.toast.error("Please Close The Door")
// }
//   })
// })

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
  search(_id: any){
  this.myform.reset();
    this.id=_id
    this.crud.changemessage3(this.id)
   // localStorage.setItem("_id",_id)
   localStorage.setItem('ids',this.id)
   localStorage.removeItem("hlo")
    this.router.navigate(['pages/details'])
    this.searchdata=""
  }
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
   localStorage.setItem('ids',this.id)
   localStorage.removeItem("hlo")
    this.router.navigate(['pages/details'])
   
  })
}
searching(event){
  console.log(event)
  if(event.target.value){
    let params: any = {};
    if (this.searchValue) {
      params['searchString'] = event.target.value;
    }
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe(res => {
    console.log(res)
    this.searchdata=res['item']
    })
  }else{
    this.searchdata=[]
  }
 
}

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


ngOnDestroy(){

}
}
