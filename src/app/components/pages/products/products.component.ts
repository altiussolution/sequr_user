import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import TurtleDB from 'turtledb';
declare const window:any;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  product: any=[];
  items: any=[];
  message: any=[];
  routername: any;
  data: any=[];
  page = 0;
  size = 4;
  d: any=[];
 /* dataa=[{
    "details":
    {"alldevinfo":
    {"List":
    [{"assigned":
    [{"column":
    [{"uid":["1305167547307745"],"lid":["1"]},{"uid":["1305167547316427"],"lid":["2"]}]}]}]}}}]*/
  coloumid: any=[];
  coloumids: any=[];
  permissions : any=[];
  machine: any=[];
  qty: any;
  coloumidss: any=[];
  mydb: any;
  itemset: any=[];
  cartdata1: any;
  cartList: any[];
  cartList1: any;
  onoff: boolean;
  newcd: any=[];
  newcart: any;
  new: { cart: any; total_quantity: any; _id: any; };
  hlo: { allocation: any; cart_status: number; item: { image_path: any; item_name: any; _id: any;  }; item_details: any; qty: number;  };
  constructor(public crud:CrudService,public router:Router,private toast: ToastrService,public route:ActivatedRoute) {
    
   }

  ngOnInit(): void {
  let data= this.route.snapshot.paramMap.get('data')
  console.log(data)
      this.route.data.subscribe(data => console.log(data));
    this.permissions=JSON.parse(localStorage.getItem("personal"))
    this.coloumidss = localStorage.getItem('coloumid')

     /* this.crud.get(appModels.COLOMNIDS).pipe(untilDestroyed(this)).subscribe((res:any) => {
    console.log(res)
   this.coloumid=res.details.alldevinfo.List[0].assigned[0].column
   console.log(this.coloumid,"cid")
   for(let i=0; i<this.coloumid?.length;i++){
     this.coloumids.push(this.coloumid[i].uid[0])
     console.log(this.coloumids,"uid")
   }
  },error=>{
    this.toast.error("Please connect the mechine")
  })*/

    this.crud.CurrentMessage2.subscribe(message=>{
      if(message !=""){
        this.routername=message
        localStorage.setItem("routename",this.routername)
      }else{
        this.routername=localStorage.getItem("routename")
      }
    })
    if(window.navigator.onLine == true){
      this.onoff=true
   this.crud.CurrentMessage1.subscribe(message=>{
     console.log(message)
    if(message !="" && !localStorage.getItem("allow1")){
      let params: any = {};
params['company_id']=this.permissions?.company_id?._id
          this.product=JSON.parse(message)
          localStorage.setItem("subid",JSON.stringify(this.product))
          console.log(this.product)
          this.d=this.coloumidss
          params['column_ids'] = this.d;
          params['category_id']=this.product?.category_id
          params['sub_category_id']=this.product?._id
          this.crud.get1(appModels.ITEMS,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
          localStorage.setItem("allow1","data")
          console.log(res)
          this.items=res['data']
          // this.itemset.push({
          //   ...{ item: this.items }
          // })
          this.getData({pageIndex: this.page, pageSize: this.size});
          })
      }/*else{
        let params: any = {};
        params['company_id']=this.permissions?.company_id?._id
        this.product=JSON.parse(localStorage.getItem("subid"))
        console.log(this.product)
        this.d=JSON.stringify(this.coloumidss)
          params['column_ids'] = this.d;
          params['category_id']=this.product?.category_id
          params['subcategory_id']=this.product?._id
        this.crud.get1(appModels.ITEMS,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
        localStorage.setItem("allow1","data")
        console.log(res)
        this.items=res['data']
        this.getData({pageIndex: this.page, pageSize: this.size});
        })
      }*/
    
    })
  }else{
    this.onoff=false
    this.getData({pageIndex: this.page, pageSize: this.size});

  }
  }
  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;
        if(window.navigator.onLine == true){

        this.data = this.items.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
        }); 
      }else{
        
    this.crud.CurrentMessage1.subscribe(message=>{
      this.message=JSON.parse(message)  
      this.mydb = new TurtleDB('example');
       this.mydb.read('getitem').then((doc) =>{console.log(doc)
      for (let i = 0; i < doc.data?.length; i++) {
       if(this.message.category_id  == doc.data[i].item[0].category_id._id && this.message._id== doc.data[i].item[0].sub_category_id._id){
        this.items = doc.data[i].item
        this.data = this.items.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
          }); 
        console.log(this.data)
         }
        }
    }) 
      } );
      }
  }
  listview(){
    
    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');
    asgrid.classList.add('as-list')
    asgridg.classList.remove('view-active')
    asgridl.classList.add('view-active')
    
  }
  gridview(){
    
    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');
   
    asgrid.classList.remove('as-list')
    asgridg.classList.add('view-active')
    asgridl.classList.remove('view-active')
  }
  select(id:any){
    this.crud.changemessage3(id)
    localStorage.setItem('ids',id)
    localStorage.removeItem("hlo")
   // localStorage.setItem("_id",id)
    this.router.navigate(['pages/details'])
  }
  addtocart(it: any, qty: number) {
    if(window.navigator.onLine == true){

    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    this.crud.get1(appModels.DETAILS + it,{params}).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.machine=[];
      this.machine = res.machine
      this.qty = this.machine.quantity
      if(this.qty>=qty){

        let cart = {
          "item" : it,
          "total_quantity" : Number(qty),
          
      }
      this.crud.post(appModels.ADDTOCART,cart).pipe(untilDestroyed(this)).subscribe((res:any) => {
        console.log(res)
        if (res != "") {
          if(res['message']=="Successfully added into cart!"){
            this.toast.success("cart added successfully")
              this.router.navigate(['pages/mycart'])
            // this.router.navigate(['pages/mycart'])
          }else if(res['message']=="Stock Not Yet Allocated"){
            this.toast.error(res['message'])
          }
         }
      },error=>{
        this.toast.error("cart added Unsuccessfully")
      })
      }else{
        this.toast.error("You have exceeded maximum quantity")
      }
    })
  }else{
  
    this.mydb = new TurtleDB('example');
    this.mydb.read('detailpage').then((doc) =>{console.log(doc)
      for (let i = 0; i < doc.data?.length; i++) {
        console.log("oi",doc.data[i].productdetails.items._id,it)
        if(it == doc.data[i].productdetails.items._id ){
          this.machine = doc.data[i].productdetails.machine
          this.items = doc.data[i].productdetails.items
          this.qty = this.machine.quantity
          console.log(this.qty)
          }
         }
    })
    console.log(this.qty>=1,this.qty,1)
    setTimeout(()=>{                           // <<<---using ()=> syntax
 
    if(this.qty>=1){
      console.log(this.qty>=1,this.qty,1)
    this.mydb = new TurtleDB('example');
    this.mydb.read('getlistcart').then((doc) =>{console.log(doc)              
        this.cartdata1 = doc.data  
        console.log(this.cartdata1)         
        this.cartList1 = [];
              
        this.newcart=this.cartdata1.cart
        console.log(this.newcart)
        const checkid = this.newcart.some(item => item.item._id === this.machine.item && item.cart_status === 1)

       // const checkstatus = this.newcart.some(item => item.cart_status === 1) && checkstatus == true
        console.log(checkid)
        if(checkid == true){

//console.log(this.machine.item)
          let mechine_id=this.machine.item
        
     const newcartdata =	this.newcart.filter(function (newcart) {
      return newcart.item._id == mechine_id && newcart.cart_status == 1  ?  newcart.qty = Number(1)+Number(newcart.qty) : newcart  ;

  })
                 console.log(newcartdata)
      //  if(newcartdata){
      //   this.newcd = this.cartdata1.cart.filter((item) => item.item.id !== mechine_id && item.cart_status ==1);
      //   console.log(this.newcd)
      //  }
   
         for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
          if (this.cartdata1?.cart[i]['cart_status'] == 1) {
            this.cartList1.push(this.cartdata1?.cart[i])
            let hi=this.cartList1.reduce((accumulator, current) => accumulator + current.qty, 0);
            console.log(hi)
            doc.data.total_quantity=hi   
          }               
        }
        this.new=({
          cart:newcartdata,
          total_quantity:doc.data.total_quantity,
          _id:doc.data._id
        })
      const dateTime = new Date();
      this.mydb = new TurtleDB('example');
     this.mydb.update('getlistcart', { data: this.new , user: this.permissions?._id,company_id:this.permissions?.company_id?._id,cartinfo:2,updatestatus:2,created_at:dateTime});
     this.toast.success("cart added successfully")


        }else {
          const dateTime = new Date();
          this.hlo=  {allocation:this.machine._id,
            cart_status:1,
            item:{
              image_path:this.items.image_path,
              item_name:this.items.item_name,
              _id:this.machine.item,
             // image:"",
            },
            item_details:this.machine,
           
            qty:Number(1),
          }
         // console.log(this.hlo)
          this.newcart.push(this.hlo)     
          console.log(this.newcart)
      
        for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
          if (this.cartdata1?.cart[i]['cart_status'] == 1) {
            this.cartList1.push(this.cartdata1?.cart[i])
            let hi=this.cartList1.reduce((accumulator, current) => accumulator + current.qty, 0);
            console.log(hi)
            doc.data.total_quantity=hi   
          }               
        }
        this.new=({
          cart:this.newcart,
          total_quantity:doc.data.total_quantity,
          _id:doc.data._id
        })
          this.mydb = new TurtleDB('example');
           this.mydb.update('getlistcart', { data: this.new , user: this.permissions?._id,company_id:this.permissions?.company_id?._id,cartinfo:2,updatestatus:1,created_at:dateTime});
           this.toast.success("cart added successfully")

        }
       // let tempArray =[];
      //   for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
      //     if(this.machine.item == this.cartdata1?.cart[i].item._id && !tempArray.includes(this.cartdata1?.cart[i].item._id)){
      //       tempArray.push(this.cartdata1?.cart[i].item._id);
      //       console.log(this.cartdata1)         

      //       // doc.data.cart[i]['cart_status'] =  1
      //       // doc.data.cart[i]['qty']=Number(1)
      //       let hlo=  {allocation:this.cartdata1?.cart[i].allocation,
      //         cart_status:1,
      //         item:{
      //           image_path:this.cartdata1?.cart[i].item.image_path,
      //           item_name:this.cartdata1?.cart[i].item.item_name,
      //           _id:this.cartdata1?.cart[i].item._id,
      //           image:[],
      //         },
      //         item_details:this.cartdata1?.cart[i].item_details,
             
      //         qty:Number(1),_id:this.cartdata1?.cart[i]._id,
      //       }
      //      // console.log(this.cartnew)
      //      this.newcd=this.cartdata1.cart
      //      this.newcd.push(hlo)    
      //      console.log(this.newcd)       
      //     }
      //   }
         

      //   this.toast.success("cart added successfully")
      //   for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
      //   if (this.cartdata1?.cart[i]['cart_status'] == 1) {
      //     this.cartList1.push(this.cartdata1?.cart[i])
      //     doc.data.total_quantity=Number(this.cartdata1?.cart[i].qty)
      //   }               
      // }
      // console.log("Updated cart value",doc.data)   
      // this.cartdata1 = doc.data;
      // console.log(this.cartdata1)
      //    console.log(this.cartList1)
      //  //  this.cart = [...this.cartdata1?.cart , ...this.cartList1];
      //  const dateTime = new Date();
      //  console.log(dateTime)
      //    this.mydb = new TurtleDB('example');
      //    this.mydb.update('getlistcart', { data: this.cartdata1 , user_id: this.permissions?._id,company_id:this.permissions?.company_id?._id,cart_info:1,created_at:dateTime});
      //    // this.mydb.mergeUpdate('getlistcart', { user_id: this.permissions?._id,company_id:this.permissions?.company_id?._id,created_at: dateTime});

        this.crud.getcarttotal(this.cartList1?.length)

       // this.router.navigate(['pages/mycart'])
      } );      
  }else{
  this.toast.error("You have exceeded maximum quantity")
}
}, 3000);
  }
  }
  ngOnDestroy(){
    localStorage.removeItem("allow")
  }
  clicktitle(){
    this.router.navigate(['pages/home'])
  }
}
