import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { CookieService } from 'ngx-cookie-service'
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {  VERSION } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  opened: boolean;
  public sidebarToggled = false;
  category: any = []
  myTextVal: any = [];
  message: any;
  category1: any = [];
  subcategory: any = [];
  searchIcon = 'search-icon';
  cartDetails: any = [];
  itemhistorykit: any = [];
  selectedItem: any;
  cartList: any = [];
  cartdata: any = [];
  item: any = [];
  name: any = [];
  val: any = [];
  searchValue: any = [];
  public codeValue: string;
  id: any;
  cartProductCount: "";
  profiledetails: any = [];
  profile: any = [];
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
  searchdata: any = [];
  typed: any;
  d: any = [];
  subcategories: any = [];
  subcatlength: any = [];
  catid: any = [];
  coloumid: any = [];
  coloumids: any = [];
  dooropens: any = [];
  dooropenss: any = [];

  @ViewChild('modal') closebutton;
  hlo: any = [];
  permissions: any = [];
  catname: any = [];
  categoryid: any = [];
  subcategories1: any = [];
  categoryName: any = [];
  subcatlengths: any = [];
  subcatlengths1: any = [];
  category_name = 'Angular ' + VERSION.major;
categories: any = [];
  constructor(public router: Router, public crud: CrudService, private cookie: CookieService, private toast: ToastrService) {
    this.permissions = JSON.parse(localStorage.getItem("personal"))
    this.profiledetails = JSON.parse(localStorage.getItem('personal'))
    let params: any = {};
    params['company_id'] = this.permissions?.company_id?._id
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.item = res.item
    })
    this.myform = new FormGroup({
      searchvalue: new FormControl("")
    })
  }



  ngOnInit(): void {
  
    this.columnid();
    // let assidebar = document.querySelector('.sidenav');
    // let body = document.querySelector('body');
    // if (assidebar.classList.contains('sidenav')) {
    //   assidebar.classList.add('sidebar-hidden');
    //   body.classList.add('activemenu');
    //   assidebar.classList.add('sidebar');
    // }

    this.profiledetails = JSON.parse(localStorage.getItem('personal'))
    console.log(this.profiledetails)
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    this.crud.get(appModels.USERPROFILE + this.profiledetails._id).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.profile = res['data']
    })

    this.crud.getProducts().subscribe(data => {
      this.cartProductCount = ""
      this.cartProductCount = data;
      console.log(this.cartProductCount)
    })
    //this.hlo=['1305167547307745', '1305167547316427']




    this.method()
  }
  columnid() {
    this.crud.get(appModels.COLOMNIDS).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.coloumid = res.details.alldevinfo?.List[0]?.assigned[0]?.column
      console.log(this.coloumid, "cid")
      this.coloumids = []
      for (let i = 0; i < this.coloumid?.length; i++) {
        this.coloumids.push(this.coloumid[i].uid[0])
        console.log(this.coloumids, "uid")
      }
      localStorage.setItem("coloumid", JSON.stringify(this.coloumids))

      console.log(JSON.stringify(this.coloumids))
      // this.categoryss();

    })
  }
  categoryss() {
    this.subcatlength = []
    this.category = []
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    this.d = JSON.stringify(this.coloumids)
    params['column_ids'] = this.d;
    this.crud.get1(appModels.CATEGORYLIST, { params }).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
      console.log(res)

      this.category = res['data']
      console.log(this.category)
    
   
      //  this.crud.changemessage(JSON.stringify(this.category[0]))
      this.selectedItem = this.category[0];

      // for (let i = 0; i < this.category?.length; i++) {
      //   let params: any = {};
      //   params['column_ids'] = this.d;
      //   params["category_id"] = this.category[i]._id;
      //   params['company_id'] = this.profiledetails?.company_id?._id
      //   this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //     console.log(res)
      //     this.subcatlength.push(res['data'])

      //   })
   
      localStorage.removeItem("firsttime")
      let i = 0
        for await(let cat of this.category) {

          let params: any = {};
          params['column_ids'] = this.d;
          params["category_id"] = cat._id;
          params['company_id'] = this.profiledetails?.company_id?._id
          this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
            console.log(res)
            let subCategory = res['data']
               
            this.categories.push({
              ...{ category: cat },
              ...{ sub_category: subCategory }
            })
           
            if(!localStorage.getItem("firsttime")){
              localStorage.setItem("firsttime","data")
              console.log(this.categories)
              localStorage.removeItem("allow")
              this.crud.changemessage(JSON.stringify(this.categories[0]))
              this.router.navigate(['pages/home'])
            }
          
         
          })
          // i++
          // if(i == this.category.length-1){
          //   this.sortingfunc();
          // }
         

          
        
        }
    

    // let das= this.sortRecursive(this.categories)

    //  let das= this.categories.sort(this.dynamicSort("category_name"));
    
     
        // let da=this.categories.sort((a, b) => (a.category.category_name > b.category.category_name) ? 1 : -1)

        // console.log(da);
        
        
        // this.categories.sort((one, two) => (one.category.category_name > two.category.category_name ? -1 : 1));
        // console.log(this.categories)
        // const sortedArr = this.sortPipe.transform(this.categories, "desc", "category_name");
        // console.log(JSON.stringify(sortedArr) )
        // params['column_ids'] = this.d;
        // params["category_id"] = this.category[0]._id;
        // params['company_id'] = this.profiledetails?.company_id?._id
        // this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
        //   console.log(res)
        //   this.subcatlengths.push(res['data'])
        //   localStorage.removeItem("allow")
        //   this.crud.changemessage(JSON.stringify(this.subcatlengths[0]))
        //   console.log(this.subcatlength)
        //   localStorage.setItem("categname", this.category[0]?.category_name)
        //   console.log(this.category)
        //   this.router.navigate(['pages/home'])
        // 


      // }





      // if(this.subcatlength.length){
      //   localStorage.removeItem("allow") 
      //   this.crud.changemessage(JSON.stringify(this.subcatlength[0]))
      //   console.log(this.subcatlength)
      //   localStorage.setItem("categname",this.category[0]?.category_name)
      //   console.log(this.category)
      //   this.selectedItem = this.category[0];
      //     this.router.navigate(['pages/home'])
      // }

      // if(this.subcatlength?.length !=0){
      //   this.pagemove()
      // }

    })
  }
  sortingfunc(){
   let sortDataA = this.categories.sort(function(a, b){
      if(a.category.category_name < b.category.category_name) { return -1; }
      if(a.category.category_name > b.category.category_name) { return 1; }
      return 0;
    })
    console.log(sortDataA)
  }
  sortRecursive(data) {
    if (data[0]) {
      data.forEach( (element) => {
        if (element.category) {
          element.category.sort((a, b) =>  a.category_name - b.category_name);
          this.sortRecursive(element.category);
        }
      });
    }
  }
   dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

  pagemove() {



  }
  method() {
    this.cartList = [];
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    params['user_id'] = this.profiledetails._id
    this.crud.get1(appModels.ITEMLIST, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.itemhistorykit = res['Kits']
      if(this.itemhistorykit==undefined){
         this.itemhistorykit=[]
      }
    })
    this.crud.get1(appModels.listCart, { params }).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.cartdata = res[0]
      for (let i = 0; i < this.cartdata?.cart?.length; i++) {
        if (this.cartdata?.cart[i]['cart_status'] == 1) {
          this.cartList.push(this.cartdata?.cart[i])
          // this.cartListlength=this.cartList.length
        }
      }

      this.crud.getcarttotal(this.cartList?.length)
    })
  }

  setval(val: any) {
    console.log(val)
    this.subcatlengths1 = []
   
    // let params: any = {};
    // params['column_ids'] = this.d;
    // params["category_id"] = val.category['_id']
    // params['company_id'] = this.profiledetails?.company_id?._id
      // localStorage.setItem('categid', val.category['_id'])
      // localStorage.setItem('categname', val.category['category_name'])
   
      this.crud.changemessage(JSON.stringify(val))
      this.router.navigate(['pages/home'])
 

  }

  logout() {

    this.dooropens = [];
    this.dooropenss = [];
    this.crud.get('machine/wasfullopen').pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.dooropens = res?.details?.alldevinfo?.Count[0].wasfullopen[0]
      console.log(this.dooropens)
      this.crud.get('machine/isfullopen').pipe(untilDestroyed(this)).subscribe((res: any) => {
        console.log(res)
        this.dooropenss = res?.details?.alldevinfo?.Count[0].isfullopen[0]
        this.alerts()
      })
    })


  }

alerts(){
  if (this.dooropens == "0" && this.dooropenss == "0") {
    // this.closebutton.nativeElement.click();
    localStorage.clear();
    this.router.navigate(['./login']);
  } else {
    this.toast.error("Please Ensure Door Is Closed Properly!")
  }
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
  search(_id: any) {
    this.myform.reset();
    this.id = _id
    this.crud.changemessage3(this.id)
    // localStorage.setItem("_id",_id)
    localStorage.setItem('ids', this.id)
    localStorage.removeItem("hlo")
    this.router.navigate(['pages/details'])
    this.searchdata = ""
  }
  public saveCode(e): void {
    let params: any = {};
    if (this.codeValue) {
      params['searchString'] = this.codeValue;
      params['company_id'] = this.profiledetails?.company_id?._id
    }
    console.log(this.codeValue)
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.item = res.item
      let find = this.item.find(x => x?.item_name === e.target.value);
      console.log(find?._id);
      this.id = find?._id
      this.crud.changemessage3(this.id)
      // localStorage.setItem("_id",find?._id)
      localStorage.setItem('ids', this.id)
      localStorage.removeItem("hlo")
      this.router.navigate(['pages/details'])

    })
  }
  searching(event) {
    localStorage.removeItem("onetimecall")
    let data = event.target.value
    setTimeout(() => {
      this.callmethod(data)

    }, 3000);

  }
  callmethod(data) {
    if (!localStorage.getItem("onetimecall")) {
      localStorage.setItem("onetimecall", "val")
      if (data) {
        let params: any = {};
        if (this.searchValue) {
          params['searchString'] = data;
          params['company_id'] = this.profiledetails?.company_id?._id
        }
        this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe(res => {
          console.log(res)
          this.searchdata = res['item']
          if (res['item'].length == 0) {
            this.toast.error("No Data Found")
          }
        })
      } else {
        this.searchdata = []
      }
    }


  }

  test() {
    let assidebar = document.querySelector('.sidenav');
    let body = document.querySelector('body');
    if (assidebar.classList.contains('sidenav')) {
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
    console.log(this.sidebarToggled);
    // debugger
    if (window.innerWidth < 600) {
      if (assidebar.classList.contains('sidebar' || '')) {
        assidebar.classList.add('sidebar-hidden');
        body.classList.remove('activemenu');
        assidebar.classList.remove('sidebar');
      }
      else {
        assidebar.classList.remove('sidebar-hidden');
        body.classList.add('activemenu');
        assidebar.classList.add('sidebar');

      }
    }
    else {
      if (this.sidebarToggled) {
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
  selectcategory(val: any, i: any) {
    // this.d=JSON.stringify(this.coloumids)
    // let params: any = {};
    //   params['column_ids'] = this.d;
    // this.crud.get1(appModels.SUBCATEGORY+this.category._id,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
    //   console.log(res)
    //   this.subcategories=res['data']
    // })
    //   localStorage.removeItem("allow1") 
    //   this.category1=category
    //   this.subcategory=val
    //   let data=this.category1.category.category_name+">"+this.subcategory?.sub_category_name
    //   this.crud.changemessage2(data)
    //   this.crud.changemessage1(JSON.stringify(val))
    localStorage.removeItem("allow1")
    // this.categoryid=localStorage.getItem("categid")
    

    this.subcategories1 = val
    let data1 = {
      "category_id":val?.category._id,
      "_id": val.sub_category[0]._id
    }
    this.categoryName = val.category?.category_name

    let data =val.category?.category_name + ">" + val.sub_category[0].sub_category_name
    this.crud.changemessage2(data)
    this.crud.changemessage1(JSON.stringify(data1))
    this.router.navigate(['/pages/products'])

    this.router.navigate(['/pages/products'])


  }


  ngOnDestroy() {

  }
}
