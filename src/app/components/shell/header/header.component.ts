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
import TurtleDB from 'turtledb';
import { Observable, Observer } from 'rxjs';
import { ConnectionService } from 'ng-connection-service';  

declare const window:any;
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
  kitdata: any=[];
  datas1: any;
  mydb: any;
  itemset: any=[];
  items: any=[];
  productdetails: any=[];
  cart: any=[];
  cartnew: any=[];
  base64Image: string;
  new: { cart: any; total_quantity: any; _id: any; };
  itemsetimage: any=[];
  itemset1: any=[];
  productdetailsimage: any=[];
  subcat: any=[];
  base64Image1: any=[];
  base64Image2: any=[];
  isConnected = true;  
  status: string;
  itemhistorykit1: any=[];
  cartdata1: any;
  itemhistorycart: any=[];
  kitdata1: any;
  cartdatanew: { cart: any; updated_at: any; _id: any; };
  resdata: { Cart: { cart: any; updated_at: any; _id: any; }[]; Kits: any; status: any; };
  kit: any;
  date: any;

  constructor(public router: Router, public crud: CrudService, private cookie: CookieService,private connectionService: ConnectionService, private toast: ToastrService) {
    // this.connectionService.monitor().subscribe(isConnected => {  
    //   this.isConnected = isConnected;  
    //   console.log(isConnected)   
    //   if (this.isConnected) {
    //     this.status = "ONLINE";
    //   }
    //   else {
    //     this.status = "OFFLINE";
    //   }
    //   console.log(this.status)
    // }) 
    this.permissions = JSON.parse(localStorage.getItem("personal"))
    this.profiledetails = JSON.parse(localStorage.getItem('personal'))
    let params: any = {};
    params['company_id'] = this.permissions?.company_id?._id
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
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
    //console.log(this.profiledetails)
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    this.crud.get(appModels.USERPROFILE + this.profiledetails._id).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      this.profile = res['data']
    })

    this.crud.getProducts().subscribe(data => {
      this.cartProductCount = ""
      this.cartProductCount = data;
      //console.log(this.cartProductCount)
    })
    //this.hlo=['1305167547307745', '1305167547316427']




    this.method()
  }
  columnid() {
    this.crud.get(appModels.COLOMNIDS).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      this.coloumid = res.details.alldevinfo?.List[0]?.assigned[0]?.column
      //console.log(this.coloumid, "cid")
      this.coloumids = []
      for (let i = 0; i < this.coloumid?.length; i++) {
        this.coloumids.push(this.coloumid[i].uid[0])
        //console.log(this.coloumids, "uid")
      }
      localStorage.setItem("coloumid", JSON.stringify(this.coloumids))

      //console.log(JSON.stringify(this.coloumids))
      this.categoryss();

    })
  }
  categoryss() {
    if(window.navigator.onLine == true){

    this.subcatlength = []
    this.category = []
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    this.d = JSON.stringify(this.coloumids)
    params['column_ids'] = this.d;
    this.crud.get1(appModels.CATEGORYLIST, { params }).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
      //console.log(res)

      this.category = res['data']
      //console.log(this.category)
    
   
      //  this.crud.changemessage(JSON.stringify(this.category[0]))
      this.selectedItem = this.category[0];

      // for (let i = 0; i < this.category?.length; i++) {
      //   let params: any = {};
      //   params['column_ids'] = this.d;
      //   params["category_id"] = this.category[i]._id;
      //   params['company_id'] = this.profiledetails?.company_id?._id
      //   this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //     //console.log(res)
      //     this.subcatlength.push(res['data'])

      //   })
   
      localStorage.removeItem("firsttime")
      let i = 0
      for (let item of this.item) {
        params['company_id']=this.permissions?.company_id?._id
        //console.log(item._id)
        this.crud.get1(appModels.DETAILS + item._id,{params}).pipe(untilDestroyed(this)).subscribe((res: any) => {
          //console.log(res)
          let details=res
          this.productdetails.push({
            ...{ productdetails: details }
            
          })
           for (let i = 0; i < this.productdetails.length; i++) {
          this.getBase64ImageFromURL(this.productdetails[i].productdetails.items.image_path[0]).subscribe(base64data => {    
            this.base64Image1.push( {image:'data:image/jpg;base64,' + base64data,name:this.productdetails[i].productdetails.items.item_name});
          });
          this.getBase64ImageFromURL(this.productdetails[i].productdetails.items.image_path[1]).subscribe(base64data => {    
            this.base64Image2.push( {image:'data:image/jpg;base64,' + base64data,name:this.productdetails[i].productdetails.items.item_name});
    
            console.log(this.base64Image2)
    
        
          });
  }
      
   setTimeout(() => {
     const hlo2 = this.productdetails.filter(v => this.base64Image1.map((val,index)=> {val.name == v.productdetails.items.item_name ? v.productdetails.items.image_path[0] = val.image:val.image}));
      //const hlo2 = this.cart.filter(v =>v);
    const hlo1=hlo2.filter(v=> this.base64Image2.map((val,index)=> {val.name == v.productdetails.items.item_name ? v.productdetails.items.image_path[1] = val.image:val.image}))
console.log(hlo2)
console.log(hlo1)
this.productdetailsimage=hlo1
console.log(this.productdetailsimage)
this.mydb = new TurtleDB('example');
        this.mydb.create({ _id: 'detailpage', data: this.productdetailsimage });

   }, 3000); 
   setTimeout(() => {
    if( this.mydb.create({ _id: 'detailpage', data: this.productdetailsimage })){
      this.mydb = new TurtleDB('example');
      this.mydb.update('detailpage', { data:this.productdetailsimage});
    
    }
  },4000);
      })
    }
        for await(let cat of this.category) {

          let params: any = {};
          params['column_ids'] = this.d;
          params["category_id"] = cat._id;
          params['company_id'] = this.profiledetails?.company_id?._id
          this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
            //console.log(res)
            let subCategory = res['data']
               
            this.categories.push({
              ...{ category: cat },
              ...{ sub_category: subCategory }
            })
            console.log(this.categories)
            for (let i = 0; i < this.categories.length; i++) {
 
   
              this.getBase64ImageFromURL(this.categories[i].sub_category[0].image_path).subscribe(base64data => {    
                this.base64Image1.push( {image:'data:image/jpg;base64,' + base64data,name:this.categories[i].sub_category[0].sub_category_name});
    
                //console.log(this.base64Image)
      
            
              });
        
      }
      setTimeout(() => {
        const hlo2 = this.categories.filter(v => this.base64Image1.map((val,index)=> {val.name == v.sub_category[0].sub_category_name ? v.sub_category[0].image_path = val.image:val.image}));
         //const hlo2 = this.cart.filter(v =>v);
    
   console.log(hlo2)
   this.mydb = new TurtleDB('example');
   this.mydb.create({ _id: 'catsidebar', subcategory: hlo2});
           this.mydb.update('catsidebar', {subcategory:hlo2 });

      }, 3000); 
            if(!localStorage.getItem("firsttime")){
              localStorage.setItem("firsttime","data")
              //console.log(this.categories)
              localStorage.removeItem("allow")
              this.crud.changemessage(JSON.stringify(this.categories[0]))
              this.router.navigate(['pages/home'])
            }
          
              for await(let subcat of subCategory) {
                params['column_ids'] = this.d;
                params['category_id']=cat._id
                params['sub_category_id']=subcat._id
                this.crud.get1(appModels.ITEMS,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
                //console.log(res)
                this.items=res['data']

                this.itemset.push({
                  
                  ...{ item: this.items }
                  
                })
                for (let i = 0; i < this.itemset.length; i++) {
 
   
                  this.getBase64ImageFromURL(this.itemset[i].item[0].image_path[0]).subscribe(base64data => {    
                    this.base64Image1.push( {image:'data:image/jpg;base64,' + base64data,name:this.itemset[i].item[0].item_name});
        
                    //console.log(this.base64Image)
          
                
                  });
            
          }
              
           setTimeout(() => {
             const hlo2 = this.itemset.filter(v => this.base64Image1.map((val,index)=> {val.name == v.item[0].item_name ? v.item[0].image_path[0] = val.image:val.image}));
              //const hlo2 = this.cart.filter(v =>v);
         
        console.log(hlo2)
        this.mydb = new TurtleDB('example');
        this.mydb.create({ _id: 'getitem', data:hlo2 });
        this.mydb.update('getitem', {data:hlo2 });
           }, 5000); 
             

       
              })
            }
         
          })
        
        }

    })
  }else{
    this.mydb = new TurtleDB('example');
        this.mydb.read('catsidebar').then((doc) =>{//console.log(doc)
          this.categories = doc.subcategory
//console.log( this.categories)
    
          } );
  }
  }

  datas(event){
    //console.log("changed")
    let data = event.target.value
    if(!data){
     this.searchdata=[]
    }
  }
  sortingfunc(){
   let sortDataA = this.categories.sort(function(a, b){
      if(a.category.category_name < b.category.category_name) { return -1; }
      if(a.category.category_name > b.category.category_name) { return 1; }
      return 0;
    })
    //console.log(sortDataA)
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
    if(window.navigator.onLine == true){
    this.cartList = [];
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    params['user_id'] = this.profiledetails._id
    this.crud.get1(appModels.ITEMLIST, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      if (res['status'] == true) {
        this.cartdata = res['Cart'][0]['cart']
        this.kitdata = res['Kits']
        this.date = res['Cart'][0]['updated_at']
        this.mydb = new TurtleDB('example');
        this.mydb.create({ _id: 'date', data: this.date });
        this.mydb.update('date', { data: this.date });
      }
    
      for (let i = 0; i < this.kitdata?.length; i++) {
        if (this.kitdata[i]['kit_status'] == 2) {
          this.itemhistorykit.push(this.kitdata[i])
        }
      }
      console.log(this.itemhistorykit)

      if(this.itemhistorykit==undefined){
         this.itemhistorykit=[]
      }
      for (let i = 0; i < this.kitdata.length; i++) {
     
        for (let j = 0; j < this.kitdata[i].kit_item_details.length; j++) {
   
          this.getBase64ImageFromURL(this.kitdata[i].kit_item_details[j].item.image_path[0]).subscribe(base64data => {    
            this.base64Image1.push( {image:'data:image/jpg;base64,' + base64data,name:this.kitdata[i].kit_item_details[j].item.item_name});
        
          });
  }
      }
   setTimeout(() => {
    this.kitdata1 = this.kitdata.filter(v => v.kit_item_details.filter((k,index) => this.base64Image1.map((val,index)=> {val.name == k.item.item_name ? k.item.image_path[0] = val.image:val.image})));
//console.log(this.kitdata1)

   }, 4000); 
   for (let i = 0; i <  this.cartdata.length; i++) {
    this.getBase64ImageFromURL(this.cartdata[i].item.image_path[0]).subscribe(base64data => {    
      this.base64Image1.push( {image:'data:image/jpg;base64,' + base64data,name:this.cartdata[i].item.item_name});
     // console.log(this.base64Image1)
    });
   }
   setTimeout(() => {
    const hlo2 = this.cartdata.filter(v => this.base64Image1.map((val,index)=> {val.name == v.item.item_name ? v.item.image_path[0] = val.image:val.image}));

//console.log(hlo2)
      this.cartdatanew=({
         cart:hlo2,
         updated_at:res['Cart'][0].updated_at,
         _id:res['Cart'][0]._id
       })
     
   // console.log(hlo)
 
  }, 3000); 

setTimeout(() => {
this.resdata=({
  Cart:[this.cartdatanew],
  Kits: this.kitdata1,
  status:res['status']
})
console.log(this.resdata)

this.mydb = new TurtleDB('example');
this.mydb.create({ _id: 'getitemlist', data: this.resdata });
this.mydb.update('getitemlist', { data: this.resdata , user: this.permissions?._id,company_id:this.permissions?.company_id?._id});

}, 5000);
    
      //this.kitdata=[]

    })
    this.crud.get1(appModels.listCart, { params }).pipe(untilDestroyed(this)).subscribe(res => {
      //console.log(res)
     
      this.cartdata = res[0]
      for (let i = 0; i < this.cartdata?.cart?.length; i++) {
        if (this.cartdata?.cart[i]['cart_status'] == 1) {
          this.cartList.push(this.cartdata?.cart[i])
          // this.cartListlength=this.cartList.length
        }
      }

      this.crud.getcarttotal(this.cartList?.length)
      this.cart=res[0].cart
      for (let i = 0; i < this.cart.length; i++) {
          this.getBase64ImageFromURL(this.cart[i].item.image_path[0]).subscribe(base64data => {    
            this.base64Image1.push( {image:'data:image/jpg;base64,' + base64data,name:this.cart[i].item.item_name});
        
          });
  }
      
   setTimeout(() => {
     const hlo2 = this.cart.filter(v => this.base64Image1.map((val,index)=> {val.name == v.item.item_name ? v.item.image_path[0] = val.image:val.image}));
 
console.log(hlo2)
        this.new=({
          cart:hlo2,
          total_quantity:res[0].total_quantity,
          _id:res[0]._id
        })
      
     console.log(this.new)
     this.mydb = new TurtleDB('example');
      this.mydb.create({_id: 'getlistcart',  data: this.new , user:this.permissions?._id,company_id:this.permissions?.company_id?._id});
      this.mydb.update('getlistcart', { data:this.new , user: this.permissions?._id,company_id:this.permissions?.company_id?._id});

   }, 3000); 
    

    })
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions?._id
    this.crud.get1("log/getUserTakenQuantity",{params}).pipe(untilDestroyed(this)).subscribe(async res => {
      //console.log(res)
      this.mydb = new TurtleDB('example');
      this.mydb.create({ _id: 'getUserTakenQuantity', data: res });
    })

    params['company_id'] = this.permissions?.company_id?._id
    this.crud.get1(appModels.KITTINGLIST, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.kit = res.data


      for (let i = 0; i < this.kit.length; i++) {

        for (let j = 0; j < this.kit[i].kit_data.length; j++) {

          this.getBase64ImageFromURL(this.kit[i].kit_data[j].item.image_path[0]).subscribe(base64data => {
            this.base64Image1.push({ image: 'data:image/jpg;base64,' + base64data, name: this.kit[i].kit_data[j].item.item_name });
          });
        }
      }
      setTimeout(() => {
        const hlo2 = this.kit.filter(v => v.kit_data.filter((k, index) => this.base64Image1.map((val, index) => { val.name == k.item.item_name ? k.item.image_path[0] = val.image : val.image })));
        this.mydb = new TurtleDB('example');
        this.mydb.create({ _id: 'kitting', kit: hlo2 });
          this.mydb.update('kitting', { kit: hlo2 });
        
      }, 4000);
    })
  }else{
    this.mydb = new TurtleDB('example');
    this.mydb.read('getitemlist').then((doc) => {
    console.log(doc)
   // this.itemhistorycart = []
      this.kitdata=doc.data.Kits
      for (let i = 0; i < this.kitdata?.length; i++) {
        if (this.kitdata[i]['kit_status'] == 2) {
          this.itemhistorykit.push(this.kitdata[i])
        }
      }
      console.log(this.itemhistorykit)
  
      if(this.itemhistorykit==undefined){
         this.itemhistorykit=[]
      }
  });

  }
  }

  setval(val: any) {
   // if (this.isConnected ) {

    console.log(val)
    this.myform.reset();
    
this.searchdata=[]
    this.subcatlengths1 = []
   
    // let params: any = {};
    // params['column_ids'] = this.d;
    // params["category_id"] = val.category['_id']
    // params['company_id'] = this.profiledetails?.company_id?._id
      // localStorage.setItem('categid', val.category['_id'])
      // localStorage.setItem('categname', val.category['category_name'])

      this.crud.changemessage(JSON.stringify(val))
      if(window.navigator.onLine == true){

      this.router.navigate(['pages/home'])
    }else{
     
    console.log("off")
        this.router.navigate(['pages/home'])
    }
  }
  getBase64ImageFromURL(url: string) {
   // //console.log("its coming")
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
          // This will call another method that will create image from url
          img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
           observer.error(err);
        };
      } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
      }
    });
  }
  getBase64Image(img: HTMLImageElement) {
   // We create a HTML canvas object that will create a 2d image
   var canvas = document.createElement("canvas");
   canvas.width = img.width;
   canvas.height = img.height;
   var ctx = canvas.getContext("2d");
   // This will draw image    
   ctx.drawImage(img, 0, 0);
   // Convert the drawn image to Data URL
   var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  logout() {
    if(window.navigator.onLine == true){

    this.dooropens = [];
    this.dooropenss = [];
    this.crud.get('machine/wasfullopen').pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      this.dooropens = res?.details?.alldevinfo?.Count[0].wasfullopen[0]
      //console.log(this.dooropens)
      this.crud.get('machine/isfullopen').pipe(untilDestroyed(this)).subscribe((res: any) => {
        //console.log(res)
        this.dooropenss = res?.details?.alldevinfo?.Count[0].isfullopen[0]
        this.alerts()
      })
    })

  }else{
    
    this.dooropens = [];
    this.dooropenss = [];
    this.crud.get('machine/wasfullopen').pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      this.dooropens = res?.details?.alldevinfo?.Count[0].wasfullopen[0]
      //console.log(this.dooropens)
      this.crud.get('machine/isfullopen').pipe(untilDestroyed(this)).subscribe((res: any) => {
        //console.log(res)
        this.dooropenss = res?.details?.alldevinfo?.Count[0].isfullopen[0]
        this.alerts()
      })
    })
  }
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
    //console.log(this.searchValue)
    let params: any = {};
    if (this.searchValue) {
      params['searchString'] = this.searchValue;
    }
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res:any) => {
      //console.log("oi",res)
      this.item=res.item
      this.val=this.item[0]._id
      //console.log(this.val)
    
      this.crud.get(appModels.DETAILS +this.val).pipe(untilDestroyed(this)).subscribe((res:any) => {
        //console.log(res)
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
    //console.log(this.codeValue)
    this.crud.get1(appModels.ITEM, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      this.item = res.item
      let find = this.item.find(x => x?.item_name === e.target.value);
      //console.log(find?._id);
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
    setTimeout(() => {
      this.callmethod(this.datas1)

    }, 5000);

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
          //console.log(res)
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

    //console.log(assidebar);

    this.sidebarToggled = !this.sidebarToggled;
    //console.log(this.sidebarToggled);
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
    //   //console.log(res)
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
    this.myform.reset();
    this.searchdata = []
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

   // this.router.navigate(['/pages/products'])


  }


  ngOnDestroy() {

  }
}
