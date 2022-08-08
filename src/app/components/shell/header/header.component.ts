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
  constructor(public router: Router, public crud: CrudService, private cookie: CookieService, private toast: ToastrService) {
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
    // if(window.navigator.onLine == true){
    //   console.log(window.navigator.onLine)
    //   this.mydb = new TurtleDB('example');
    //   this.mydb.setRemote('http://13.232.128.227:3000');
    //   this.mydb.create({ _id: 'sync', data: ' Synced' });

    //   this.mydb.sync();
    //   if(this.mydb.sync()){
    //     alert("synced")

    //   }
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
            //console.log(this.productdetails[i].productdetails.items.image_path[0])
                  if(this.productdetails[i].productdetails.items.image_path[0] == undefined){
            this.productdetailsimage.push({
              productdetails:{  items:{
                active_status:this.productdetails[i].productdetails.items.active_status,
              auto_purchase_order:this.productdetails[i].productdetails.items.auto_purchase_order,
              calibration_month:this.productdetails[i].productdetails.items.calibration_month,
              category_id:this.productdetails[i].productdetails.items.category_id,
              company_id:this.productdetails[i].productdetails.items.company_id,
              createdAt:this.productdetails[i].productdetails.items.createdAt,
              created_at:this.productdetails[i].productdetails.items.created_at,
              deleted_at:this.productdetails[i].productdetails.items.deleted_at,
              description:this.productdetails[i].productdetails.items.description,
              generate_po_for:this.productdetails[i].productdetails.items.generate_po_for,
              generate_po_on:this.productdetails[i].productdetails.items.generate_po_on,
              image_path:this.productdetails[i].productdetails.items.image_path,
              in_stock:this.productdetails[i].productdetails.items.in_stock,
              is_active:this.productdetails[i].productdetails.items.is_active,
              is_auto_po_generated:this.productdetails[i].productdetails.items.is_auto_po_generated,
              is_gages:this.productdetails[i].productdetails.items.is_gages,
              is_item:this.productdetails[i].productdetails.items.is_item,
              item_name:this.productdetails[i].productdetails.items.item_name,
              item_number:this.productdetails[i].productdetails.items.item_number,
              returnable:this.productdetails[i].productdetails.items.returnable,
              sub_category_id:this.productdetails[i].productdetails.items.sub_category_id,
              supplier:this.productdetails[i].productdetails.items.supplier,
              updated_at:this.productdetails[i].productdetails.items.updated_at,
              _id:this.productdetails[i].productdetails.items._id,
              image:[],
              },machine:this.productdetails[i].productdetails.machine
            }
              })
            //console.log(this.productdetailsimage)
          }
        this.getBase64ImageFromURL(this.productdetails[i].productdetails.items.image_path[0]).subscribe(base64data => {    
         // //console.log(base64data);
          this.base64Image = 'data:image/jpg;base64,' + base64data;
          ////console.log(this.base64Image)        

          this.productdetailsimage.push({
            productdetails:{  items:{
              active_status:this.productdetails[i].productdetails.items.active_status,
            auto_purchase_order:this.productdetails[i].productdetails.items.auto_purchase_order,
            calibration_month:this.productdetails[i].productdetails.items.calibration_month,
            category_id:this.productdetails[i].productdetails.items.category_id,
            company_id:this.productdetails[i].productdetails.items.company_id,
            createdAt:this.productdetails[i].productdetails.items.createdAt,
            created_at:this.productdetails[i].productdetails.items.created_at,
            deleted_at:this.productdetails[i].productdetails.items.deleted_at,
            description:this.productdetails[i].productdetails.items.description,
            generate_po_for:this.productdetails[i].productdetails.items.generate_po_for,
            generate_po_on:this.productdetails[i].productdetails.items.generate_po_on,
            image_path:this.productdetails[i].productdetails.items.image_path,
            in_stock:this.productdetails[i].productdetails.items.in_stock,
            is_active:this.productdetails[i].productdetails.items.is_active,
            is_auto_po_generated:this.productdetails[i].productdetails.items.is_auto_po_generated,
            is_gages:this.productdetails[i].productdetails.items.is_gages,
            is_item:this.productdetails[i].productdetails.items.is_item,
            item_name:this.productdetails[i].productdetails.items.item_name,
            item_number:this.productdetails[i].productdetails.items.item_number,
            returnable:this.productdetails[i].productdetails.items.returnable,
            sub_category_id:this.productdetails[i].productdetails.items.sub_category_id,
            supplier:this.productdetails[i].productdetails.items.supplier,
            updated_at:this.productdetails[i].productdetails.items.updated_at,
            _id:this.productdetails[i].productdetails.items._id,
            image:[this.base64Image],
            },machine:this.productdetails[i].productdetails.machine
          }
            })
          
        });
    
    
          }
          //console.log(this.productdetailsimage)

          this.mydb = new TurtleDB('example');
          this.mydb.create({ _id: 'detailpage', data: this.productdetailsimage });
          //console.log(this.productdetails)
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
              //console.log(this.categories[i].sub_category[0].image_path)
                    if(this.categories[i].sub_category[0].image_path == undefined){
                      this.subcat.push({
                        category:this.categories[i].category,
                        sub_category:[{
                        active_status: this.categories[i].sub_category[0].active_status,
                        category_id: this.categories[i].sub_category[0].category_id,
                        company_id: this.categories[i].sub_category[0].company_id,
                        createdAt: this.categories[i].sub_category[0].createdAt,
                        created_at:this.categories[i].sub_category[0].created_at,
                        deleted_at:this.categories[i].sub_category[0].deleted_at,
                        description: this.categories[i].sub_category[0].description,
                        image_path: this.categories[i].sub_category[0].image_path,
                        is_active: this.categories[i].sub_category[0].is_active,
                        sub_category_code:this.categories[i].sub_category[0].sub_category_code,
                        sub_category_name: this.categories[i].sub_category[0].sub_category_name,
                        updated_at: this.categories[i].sub_category[0].updated_at,
                        image:[],
                        _id:this.categories[i].sub_category[0]._id,
                        } ]
                       })
            
            }
          this.getBase64ImageFromURL(this.categories[i].sub_category[0].image_path).subscribe(base64data => {    
            this.base64Image = 'data:image/jpg;base64,' + base64data;
           this.subcat.push({
            category:this.categories[i].category,
            sub_category:[{
            active_status: this.categories[i].sub_category[0].active_status,
            category_id: this.categories[i].sub_category[0].category_id,
            company_id: this.categories[i].sub_category[0].company_id,
            createdAt: this.categories[i].sub_category[0].createdAt,
            created_at:this.categories[i].sub_category[0].created_at,
            deleted_at:this.categories[i].sub_category[0].deleted_at,
            description: this.categories[i].sub_category[0].description,
            image_path: this.categories[i].sub_category[0].image_path,
            is_active: this.categories[i].sub_category[0].is_active,
            sub_category_code:this.categories[i].sub_category[0].sub_category_code,
            sub_category_name: this.categories[i].sub_category[0].sub_category_name,
            updated_at: this.categories[i].sub_category[0].updated_at,
            image: this.base64Image,
            _id:this.categories[i].sub_category[0]._id,
            } ]
           })
            console.log(this.subcat)
            this.mydb = new TurtleDB('example');
            this.mydb.create({ _id: 'catsidebar', subcategory: this.subcat });
          });
      
      
            }
   
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
                  //console.log(this.itemset[i].item[0].image_path[0], this.itemset.length)
                        if(this.itemset[i].item[0].image_path[0] == undefined){
                  this.itemsetimage.push({
                    item:[{
                      active_status:this.itemset[i].item[0].active_status,
                    auto_purchase_order:this.itemset[i].item[0].auto_purchase_order,
                    calibration_month:this.itemset[i].item[0].calibration_month,
                    category_id:this.itemset[i].item[0].category_id,
                    company_id:this.itemset[i].item[0].company_id,
                    createdAt:this.itemset[i].item[0].createdAt,
                    created_at:this.itemset[i].item[0].created_at,
                    deleted_at:this.itemset[i].item[0].deleted_at,
                    description:this.itemset[i].item[0].description,
                    generate_po_for:this.itemset[i].item[0].generate_po_for,
                    generate_po_on:this.itemset[i].item[0].generate_po_on,
                    image_path:this.itemset[i].item[0].image_path,
                    in_stock:this.itemset[i].item[0].in_stock,
                    is_active:this.itemset[i].item[0].is_active,
                    is_auto_po_generated:this.itemset[i].item[0].is_auto_po_generated,
                    is_gages:this.itemset[i].item[0].is_gages,
                    is_item:this.itemset[i].item[0].is_item,
                    item_name:this.itemset[i].item[0].item_name,
                    item_number:this.itemset[i].item[0].item_number,
                    returnable:this.itemset[i].item[0].returnable,
                    sub_category_id:this.itemset[i].item[0].sub_category_id,
                    supplier:this.itemset[i].item[0].supplier,
                    updated_at:this.itemset[i].item[0].updated_at,
                    _id:this.itemset[i].item[0]._id,
                    image:[],
                    }]
                    })
                  //console.log(this.itemsetimage)
                }
              this.getBase64ImageFromURL(this.itemset[i].item[0].image_path[0]).subscribe(base64data => {    
               // //console.log(base64data);
                this.base64Image = 'data:image/jpg;base64,' + base64data;
                ////console.log(this.base64Image)        

                  this.itemsetimage.push({
                    item:[{
                    active_status:this.itemset[i].item[0].active_status,
                    auto_purchase_order:this.itemset[i].item[0].auto_purchase_order,
                    calibration_month:this.itemset[i].item[0].calibration_month,
                    category_id:this.itemset[i].item[0].category_id,
                    company_id:this.itemset[i].item[0].company_id,
                    createdAt:this.itemset[i].item[0].createdAt,
                    created_at:this.itemset[i].item[0].created_at,
                    deleted_at:this.itemset[i].item[0].deleted_at,
                    description:this.itemset[i].item[0].description,
                    generate_po_for:this.itemset[i].item[0].generate_po_for,
                    generate_po_on:this.itemset[i].item[0].generate_po_on,
                    image_path:this.itemset[i].item[0].image_path,
                    in_stock:this.itemset[i].item[0].in_stock,
                    is_active:this.itemset[i].item[0].is_active,
                    is_auto_po_generated:this.itemset[i].item[0].is_auto_po_generated,
                    is_gages:this.itemset[i].item[0].is_gages,
                    is_item:this.itemset[i].item[0].is_item,
                    item_name:this.itemset[i].item[0].item_name,
                    item_number:this.itemset[i].item[0].item_number,
                    returnable:this.itemset[i].item[0].returnable,
                    sub_category_id:this.itemset[i].item[0].sub_category_id,
                    supplier:this.itemset[i].item[0].supplier,
                    updated_at:this.itemset[i].item[0].updated_at,
                    _id:this.itemset[i].item[0]._id,
                    image:[this.base64Image],
                    }]
                  })
                  //console.log(this.itemsetimage)
                
              });
          
          
                }
          
                this.mydb = new TurtleDB('example');
                this.mydb.create({ _id: 'getitem', data:this.itemsetimage });
                setTimeout(()=>{                           // <<<---using ()=> syntax
                  this.mydb.read('getitem').then((doc) =>{//console.log(doc)
                  })
                              }, 3000);
            
                //console.log({ _id: 'getitem', data:this.itemset })
                //console.log(this.itemset)
       
              })
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

        // //console.log(da);
        
        
        // this.categories.sort((one, two) => (one.category.category_name > two.category.category_name ? -1 : 1));
        // //console.log(this.categories)
        // const sortedArr = this.sortPipe.transform(this.categories, "desc", "category_name");
        // //console.log(JSON.stringify(sortedArr) )
        // params['column_ids'] = this.d;
        // params["category_id"] = this.category[0]._id;
        // params['company_id'] = this.profiledetails?.company_id?._id
        // this.crud.get1(appModels.SUBCATEGORY, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
        //   //console.log(res)
        //   this.subcatlengths.push(res['data'])
        //   localStorage.removeItem("allow")
        //   this.crud.changemessage(JSON.stringify(this.subcatlengths[0]))
        //   //console.log(this.subcatlength)
        //   localStorage.setItem("categname", this.category[0]?.category_name)
        //   //console.log(this.category)
        //   this.router.navigate(['pages/home'])
        // 


      // }





      // if(this.subcatlength.length){
      //   localStorage.removeItem("allow") 
      //   this.crud.changemessage(JSON.stringify(this.subcatlength[0]))
      //   //console.log(this.subcatlength)
      //   localStorage.setItem("categname",this.category[0]?.category_name)
      //   //console.log(this.category)
      //   this.selectedItem = this.category[0];
      //     this.router.navigate(['pages/home'])
      // }

      // if(this.subcatlength?.length !=0){
      //   this.pagemove()
      // }

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
    this.cartList = [];
    let params: any = {};
    params['company_id'] = this.profiledetails?.company_id?._id
    params['user_id'] = this.profiledetails._id
    this.crud.get1(appModels.ITEMLIST, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
      //console.log(res)
      this.kitdata=[]
      this.kitdata = res['Kits']
      for (let i = 0; i < this.kitdata?.length; i++) {
        if (this.kitdata[i]['kit_status'] == 2) {
          this.itemhistorykit.push(this.kitdata[i])
        }
      }
      this.mydb = new TurtleDB('example');
      this.mydb.create({ _id: 'itemhistorykit', data: this.itemhistorykit });
      if(this.itemhistorykit==undefined){
         this.itemhistorykit=[]
      }
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
      //console.log(this.cartList?.length)
      this.cart=res[0].cart
      for (let i = 0; i < this.cart.length; i++) {

              if(this.cart[i].item.image_path[0] == undefined){
        this.cartnew.push({

          allocation:this.cart[i].allocation,
          cart_status:this.cart[i].cart_status,item:{
            image_path:this.cart[i].item.image_path,
            item_name:this.cart[i].item.item_name,
            _id:this.cart[i].item._id,
            image:[],
          },
          item_details:this.cart[i].item_details,
          qty:this.cart[i].qty,_id:this.cart[i]._id,
        })
       // //console.log(this.cartnew)
      }
    this.getBase64ImageFromURL(this.cart[i].item.image_path[0]).subscribe(base64data => {    
    // //console.log(base64data);
      this.base64Image = 'data:image/jpg;base64,' + base64data;
     // //console.log(this.base64Image)

        this.cartnew.push(
          {
            allocation:this.cart[i].allocation,
            cart_status:this.cart[i].cart_status,
          item:{
            image_path:this.cart[i].item.image_path,
            item_name:this.cart[i].item.item_name,
            _id:this.cart[i].item._id,
            image:this.base64Image,
          },
          item_details:this.cart[i].item_details,
         
          qty:this.cart[i].qty,_id:this.cart[i]._id,
        
        })
      //  //console.log(this.cartnew)
        this.new=({
          cart:this.cartnew,
          total_quantity:res[0].total_quantity,
          _id:res[0]._id
        })
      
      //   let cart=[{
      //     cart:this.cartnew,
      //     total_quantity:res[0].total_quantity,
      //     _id:res[0]._id,
         
      //  }]
      //  //console.log(cart)
    //    const dateTime = new Date();

    //   const data1={
    //     cart:this.cartnew,
    //     total_quantity:res[0].total_quantity,
    //     _id:res[0]._id,
    //     "user_id":this.permissions?._id,
    //   "company_id":this.permissions?.company_id?._id,
    //    //"cart_info":1,
    //   // "created_at":dateTime
    //   }
    //  //  let data1=[hlo, {"user_id":this.permissions?._id}]

    //     // this.array.push([hlo,""])
    //    //console.log(data1)

        //console.log(this.new)
        if(this.new){
        this.mydb = new TurtleDB('example');
      this.mydb.create({_id: 'getlistcart',  data: this.new , user:this.permissions?._id,company_id:this.permissions?.company_id?._id});
        //console.log('getlistcart', { data: this.new , user_id:this.permissions?._id,company_id:this.permissions?.company_id?._id})
        }
       // //console.log({ _id: 'getlistcart', cart: this.new, user_id: this.permissions?._id,company_id:this.permissions?.company_id?._id})
       // this.mydb.create({ _id: 'getlistcart', cart: this.new });
        //this.mydb.mergeUpdate('getlistcart', { user_id: this.permissions?._id,company_id:this.permissions?.company_id?._id });
 
    });

      }
     // //console.log(this.new)

      // this.mydb = new TurtleDB('example');
      // this.mydb.create({ _id: 'getlistcart', cart: res[0] }); 


    })
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions?._id
    this.crud.get1("log/getUserTakenQuantity",{params}).pipe(untilDestroyed(this)).subscribe(async res => {
      //console.log(res)
      this.mydb = new TurtleDB('example');
      this.mydb.create({ _id: 'getUserTakenQuantity', data: res });
    })
  }

  setval(val: any) {
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
  
      this.router.navigate(['pages/home'])
    
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
