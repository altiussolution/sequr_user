import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import TurtleDB from 'turtledb';
import { Observable, Observer } from 'rxjs';
declare const window: any;


@Component({
  selector: 'app-productslist',
  templateUrl: './productslist.component.html',
  styleUrls: ['./productslist.component.scss']
})
export class ProductslistComponent implements OnInit {
  kit: any = [];
  page = 0;
  size = 4;
  data: any;
  id: any;
  kitdata: any = [];
  item: any = [];
  bin: any = [];
  compartment: any = [];
  cube: any = [];
  itemhistorykit: any = [];
  takeNowKit: any = [];
  machineCubeID: any;
  machineColumnID: any;
  machineDrawID: any;
  machineCompartmentID: any;
  machineStatus: any;
  msg: string;
  msgg: string;
  kitdatas: any = [];
  kits: any;
  List: any;
  highkitqty: any = [];
  permissions: any = [];
  totalquantity: any = [];
  kitdatas1: any;
  qtyss: number;
  dooropen: boolean = false;
  mydb: any;
  kitting: any = [];
  base64Image: any = [];
  kittingnew: any = [];
  kit1: any = [];
  kitnewdata: any;
  onoff: boolean;
  hlo2: any;
  hlo: any = [];
  new: { Cart: any; Kits: (hlo: any) => void; status: boolean; };
  dateTime: Date;
  kit_item_details: any = [];
  takenowdata: any;
  product: any;
  constructor(public crud: CrudService, private toast: ToastrService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.permissions = JSON.parse(localStorage.getItem("personal"))

    if (window.navigator.onLine == true) {
      this.onoff = true

      let params: any = {};
      params['company_id'] = this.permissions?.company_id?._id
      this.crud.get1(appModels.KITTINGLIST, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
        //console.log(res)
        this.kit = res.data


        for (let i = 0; i < this.kit.length; i++) {

          for (let j = 0; j < this.kit[i].kit_data.length; j++) {

            this.getBase64ImageFromURL(this.kit[i].kit_data[j].item.image_path[0]).subscribe(base64data => {
              this.base64Image.push({ image: 'data:image/jpg;base64,' + base64data, name: this.kit[i].kit_data[j].item.item_name });
            });
          }
        }
        setTimeout(() => {
          const hlo2 = this.kit.filter(v => v.kit_data.filter((k, index) => this.base64Image.map((val, index) => { val.name == k.item.item_name ? k.item.image_path[0] = val.image : val.image })));
          this.mydb = new TurtleDB('example');
          //this.mydb.create({ _id: 'kitting', kit: hlo2 });
         // if (this.mydb.create({ _id: 'kitting', kit: hlo2 })) {
            this.mydb.update('kitting', { kit: hlo2 });
         // }
        }, 6000);



        this.getData({ pageIndex: this.page, pageSize: this.size });
      })
    } else {
      this.onoff = false
      this.getData({ pageIndex: this.page, pageSize: this.size });

    }

  }

  modaldismiss() {
    this.machineCubeID = []
    this.machineColumnID = []
    this.machineDrawID = []
    this.machineCompartmentID = []
    this.machineStatus = []
    this.msg = "";
    this.msgg = "";
    this.ngOnInit()
  }
  addkitcart(_id: any, data, modal) {
    //console.log(this.hlo2)

    if (window.navigator.onLine == true) {
      // this.mydb = new TurtleDB('example');
      // this.mydb.create({ _id: 'addkittocartid', data: _id });
      let params: any = {};
      params['company_id'] = this.permissions?.company_id?._id
      params['user_id'] = this.permissions?._id
      this.crud.get1("log/getUserTakenQuantity", { params }).pipe(untilDestroyed(this)).subscribe(async res => {
        //console.log(res)
        // this.mydb = new TurtleDB('example');
        // this.mydb.create({ _id: 'getUserTakenQuantity', data: res });
        if (res?.data?.length != 0) {
          this.totalquantity = res['data']
          this.totalquantity.trasaction_qty
          this.kitdatas1 = data
          this.qtyss = 0
          for (let j = 0; j < this.kitdatas1?.kit_data?.length; j++) {
            this.qtyss += this.kitdatas1?.kit_data[j]?.kit_item_qty;
            //console.log(this.qtyss)
          }
          if (this.permissions?.item_max_quantity >= this.totalquantity[0]?.trasaction_qty + this.qtyss) {
            this.highkitqty = [];
            //console.log(data)
            this.kitdatas = data
            //console.log(this.kitdatas.kit_data)
            this.kits = this.kitdatas.kit_data.map(m => {
              if (m.kit_item_qty > m.quantity) {
                this.highkitqty.push(m?.kit_item_qty + '>' + m?.qty)
                return false;
              }
              return true;
            })
            //console.log(this.kits)
            this.List = this.kits.filter(item => item === false);
            //console.log(this.List)
            if (this.List?.length == 0) {
              this.dooropen = false;
              this.modalService.open(modal, { backdrop: false });
              this.crud.post(appModels.ADDKITCART + _id).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
                //console.log(res)
                if (res != "") {
                  if (res['message'] == "Successfully added into cart!") {
                    //  this.toast.success("Kitting cart added successfully")
                    await this.itemHistory(data)

                  }
                }
              }, error => {
                //  this.toast.error("Kitting cart added Unsuccessfully")
              })
            } else {
              // this.toast.error("now choosed the kit item quantity for"+this.highkitqty)
              this.toast.error("Requested Quantity Was Not Available")
            }

          }
          else {
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
        } else {

          this.kitdatas1 = data
          this.qtyss = 0
          for (let j = 0; j < this.kitdatas1?.kit_data?.length; j++) {
            this.qtyss += this.kitdatas1?.kit_data[j]?.kit_item_qty;
            //console.log(this.qtyss)
          }
          if (this.permissions?.item_max_quantity >= 0 + this.qtyss) {
            this.highkitqty = [];
            //console.log(data)
            this.kitdatas = data
            //console.log(this.kitdatas.kit_data)
            this.kits = this.kitdatas.kit_data.map(m => {
              if (m.kit_item_qty > m.quantity) {
                this.highkitqty.push(m?.kit_item_qty + '>' + m?.qty)
                return false;
              }
              return true;
            })
            //console.log(this.kits)
            this.List = this.kits.filter(item => item === false);
            //console.log(this.List)
            if (this.List?.length == 0) {
              this.dooropen = false;
              this.modalService.open(modal, { backdrop: false });
              this.crud.post(appModels.ADDKITCART + _id).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
                //console.log(res)
                if (res != "") {
                  if (res['message'] == "Successfully added into cart!") {
                    //  this.toast.success("Kitting cart added successfully")
                    await this.itemHistory(data)

                  }
                }
              }, error => {
                //  this.toast.error("Kitting cart added Unsuccessfully")
              })
            } else {
              // this.toast.error("now choosed the kit item quantity for"+this.highkitqty)
              this.toast.error("Requested Quantity Was Not Available")
            }

          } else {
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
        }

      })
    } else {
      this.mydb = new TurtleDB('example');
      this.mydb.read('getUserTakenQuantity').then(async (doc) => {//console.log(doc)
        const res = doc.data
        if (res?.data?.length != 0) {
          this.totalquantity = res['data']
          this.totalquantity.trasaction_qty
          this.kitdatas1 = data
          this.qtyss = 0
          for (let j = 0; j < this.kitdatas1?.kit_data?.length; j++) {
            this.qtyss += this.kitdatas1?.kit_data[j]?.kit_item_qty;
            //console.log(this.qtyss)
          }
          if (this.permissions?.item_max_quantity >= this.totalquantity[0]?.trasaction_qty + this.qtyss) {
            this.highkitqty = [];
            //console.log(data)
            this.kitdatas = data
            //console.log(this.kitdatas.kit_data)
            this.kits = this.kitdatas.kit_data.map(m => {
              if (m.kit_item_qty > m.quantity) {
                this.highkitqty.push(m?.kit_item_qty + '>' + m?.qty)
                return false;
              }
              return true;
            })
            //console.log(this.kits)
            this.List = this.kits.filter(item => item === false);
            //console.log(this.List)
            if (this.List?.length == 0) {
              //this.dooropen = false;
              this.dooropen = true;

              this.modalService.open(modal, { backdrop: false });
              //_id
              // this.mydb.read('addkittocartid').then((doc) =>{//console.log(doc)
              // })
              //update itemhistoy
              await this.itemHistoryoffline(data)

            } else {
              // this.toast.error("now choosed the kit item quantity for"+this.highkitqty)
              this.toast.error("Requested Quantity Was Not Available")
            }
          }
          else {
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
        } else {

          this.kitdatas1 = data
          this.qtyss = 0
          for (let j = 0; j < this.kitdatas1?.kit_data?.length; j++) {
            this.qtyss += this.kitdatas1?.kit_data[j]?.kit_item_qty;
            //console.log(this.qtyss)
          }
          if (this.permissions?.item_max_quantity >= 0 + this.qtyss) {
            this.highkitqty = [];
            //console.log(data)
            this.kitdatas = data
            //console.log(this.kitdatas.kit_data)
            this.kits = this.kitdatas.kit_data.map(m => {
              if (m.kit_item_qty > m.quantity) {
                this.highkitqty.push(m?.kit_item_qty + '>' + m?.qty)
                return false;
              }
              return true;
            })
            //console.log(this.kits)
            this.List = this.kits.filter(item => item === false);
            //console.log(this.List)
            if (this.List?.length == 0) {
             // this.dooropen = false;
             this.dooropen = true;

              this.modalService.open(modal, { backdrop: false });
              //_id
              // this.mydb.read('addkittocartid').then((doc) =>{//console.log(doc)
              // })
              //update itemhistoy
              await this.itemHistoryoffline(data)

            } else {
              // this.toast.error("now choosed the kit item quantity for"+this.highkitqty)
              this.toast.error("Requested Quantity Was Not Available")
            }

          } else {
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
        }


      });
    }

  }
  async itemHistory(data) {
    this.machineCubeID = []
    this.machineColumnID = []
    this.machineDrawID = []
    this.machineCompartmentID = []
    this.machineStatus = []
    this.msg = "";
    this.msgg = "";
    let params: any = {};
    params['company_id'] = this.permissions?.company_id?._id
    params['user_id'] = this.permissions?._id
    this.crud.get1(appModels.ITEMLIST, { params }).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
      //console.log(res)
      this.id = res?.Cart[0]['_id']
      this.itemhistorykit = res['Kits']
      for await (let kit of this.itemhistorykit) {
        //console.log(typeof kit.kit_status + ' ' + kit.kit_status)
        //console.log(typeof kit.kit_id._id + ' ' + kit.kit_id._id)
        //console.log(kit)
        if (kit.kit_status === 1 && kit.kit_id._id === data._id) {
          await this.takeNowKit.push(kit)
        }
      }
      await this.takeKit('kit')
    })
  }
  async itemHistoryoffline(data) {
    this.machineCubeID = []
    this.machineColumnID = []
    this.machineDrawID = []
    this.machineCompartmentID = []
    this.machineStatus = []
    this.msg = "";
    this.msgg = "";
    let params: any = {};
    console.log(data)
    this.takenowdata=data
    this.mydb = new TurtleDB('example');
    this.mydb.read('getitemlist').then(async (doc) => {
      console.log(doc)
      this.itemhistorykit = doc.data['Kits']
    //   this.mydb.read('detailpage').then((doc) => {
    //     console.log(doc)
    //     this.product=doc.data
   
    
    //   for (let k = 0; k < this.itemhistorykit.length; k++) {  
    //     for (let i = 0; i < this.itemhistorykit[k].kit_item_details.length; i++) {

    //       for (let j = 0; j < data.kit_data.length; j++) {
    //         if(data.kit_data[j].item._id === this.itemhistorykit[k].kit_item_details[i].item._id){
    //           this.itemhistorykit[k].kit_item_details[i].quantity = this.itemhistorykit[k].kit_item_details[i].quantity - this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit
    //           console.log(this.itemhistorykit[k].kit_item_details[i].quantity)
    //       for (let l = 0; l < this.product?.length; l++) {
         
    //            if (data.kit_data[j].item._id ===this.product[l].productdetails.machine.item) {
    //              this.product[l].productdetails.machine.quantity=this.itemhistorykit[k].kit_item_details[i].quantity
    //              console.log(doc.data[l].productdetails.machine.quantity,this.itemhistorykit[k].kit_item_details[i].quantity)
    //                this.mydb = new TurtleDB('example');
    //                this.mydb.update('detailpage', {data:this.product });
    //             }
             
    //          }
    //       }
      
    //   }
  
    // }
    //     } 
    //   }); 
                for (let k = 0; k < this.itemhistorykit.length; k++) {
            for (let i = 0; i < this.itemhistorykit[k].kit_item_details.length; i++) {

        for (let j = 0; j < data.kit_data.length; j++) {
          console.log(this.itemhistorykit[k].kit_item_details[i].item._id == data.kit_data[j].item._id,this.itemhistorykit[k].kit_item_details[i].item._id , data.kit_data[j].item._id)
        if(this.itemhistorykit[k].kit_item_details[i].item._id == data.kit_data[j].item._id){
          this.itemhistorykit[k].kit_item_details[i].quantity = this.itemhistorykit[k].kit_item_details[i].quantity - this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit

          console.log(this.itemhistorykit[k].kit_item_details[i].quantity,data.kit_data[j].quantity, this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit)
        }
      }
    }
  }
      this.dateTime = new Date();

      for (let k = 0; k < this.itemhistorykit.length; k++) {
        //console.log(typeof kit.kit_status + ' ' + kit.kit_status)
        //console.log(typeof kit.kit_id._id + ' ' + kit.kit_id._id)
        //console.log(kit)
        console.log(this.itemhistorykit[k].kit_id._id)
        this.kit_item_details = []
        if (this.itemhistorykit[k].kit_id._id === data._id) {
          for (let i = 0; i < this.itemhistorykit[k].kit_item_details.length; i++) {
          //  this.itemhistorykit[k].kit_item_details[i].quantity = this.itemhistorykit[k].kit_item_details[i].quantity - this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit,
          
            this.kit_item_details.push({
              active_status: this.itemhistorykit[k].kit_item_details[i].active_status,
              alloted_item_qty_in_kit: this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit,
              bin: this.itemhistorykit[k].kit_item_details[i].bin,
              category: this.itemhistorykit[k].kit_item_details[i].category,
              company_id: this.itemhistorykit[k].kit_item_details[i].company_id,
              compartment: this.itemhistorykit[k].kit_item_details[i].compartment,
              compartment_number: this.itemhistorykit[k].kit_item_details[i].compartment_number,
              created_at: this.itemhistorykit[k].kit_item_details[i].created_at,
              cube: this.itemhistorykit[k].kit_item_details[i].cube,
              deleted_at: this.itemhistorykit[k].kit_item_details[i].deleted_at,
              description: this.itemhistorykit[k].kit_item_details[i].description,
              item: this.itemhistorykit[k].kit_item_details[i].item,
              po_history: this.itemhistorykit[k].kit_item_details[i].po_history,
              purchase_order: this.itemhistorykit[k].kit_item_details[i].purchase_order,
              quantity: this.itemhistorykit[k].kit_item_details[i].quantity  ,
              status: this.itemhistorykit[k].kit_item_details[i].status,
              sub_category: this.itemhistorykit[k].kit_item_details[i].sub_category,
              supplier: this.itemhistorykit[k].kit_item_details[i].supplier,
              total_quantity: this.itemhistorykit[k].kit_item_details[i].total_quantity,
              updated_at: this.itemhistorykit[k].kit_item_details[i].updated_at,

              _id: this.itemhistorykit[k].kit_item_details[i]._id,

            })
         
          }

          this.hlo = {
            cart_id: this.itemhistorykit[k].cart_id,
            created_at: this.dateTime,
            // kit_cart_id:  this.itemhistorykit[k].kit_cart_id,
            kit_id: this.itemhistorykit[k].kit_id,
            kit_item_details: this.kit_item_details,
            kit_name: this.itemhistorykit[k].kit_name,
            kit_status: 2,
            qty: 1,
            // update_kit_id:  this.itemhistorykit[k].update_kit_id,
            updated_at: this.dateTime
          }


        } else {
          this.kit_item_details = []

          for (let i = 0; i < data.kit_data.length; i++) {

            this.kit_item_details.push({
              active_status: data.kit_data[i].active_status,
              alloted_item_qty_in_kit: data.kit_data[i].kit_item_qty,
              bin: data.kit_data[i].bin,
              category: data.kit_data[i].category,
              company_id: data.kit_data[i].company_id,
              compartment: data.kit_data[i].compartment,
              compartment_number: data.kit_data[i].compartment_number,
              created_at: data.kit_data[i].created_at,
              cube: data.kit_data[i].cube,
              deleted_at: data.kit_data[i].deleted_at,
              description: data.kit_data[i].description,
              item: data.kit_data[i].item,
              po_history: data.kit_data[i].po_history,
              purchase_order: data.kit_data[i].purchase_order,
              quantity: data.kit_data[i].quantity - data.kit_data[i].kit_item_qty,
              status: data.kit_data[i].status,
              sub_category: data.kit_data[i].sub_category,
              supplier: data.kit_data[i].supplier,
              total_quantity: data.kit_data[i].total_quantity,
              updated_at: data.kit_data[i].updated_at,

              _id: data.kit_data[i]._id,

            }

            )
            console.log(this.kit_item_details)



          }
          this.hlo = {
            cart_id: doc.data['Cart'][0]._id,
            created_at: this.dateTime,
            // kit_cart_id:  this.itemhistorykit[k].kit_cart_id,
            kit_id: data._id,
            kit_item_details: this.kit_item_details,


            kit_name: data.kit_name,
            kit_status: 2,
            qty: 1,
            // update_kit_id:  this.itemhistorykit[k].update_kit_id,
            updated_at: this.dateTime
          }


        }





      }
      console.log(this.hlo)
      this.itemhistorykit.push(this.hlo)
      console.log(this.itemhistorykit)
      if(this.itemhistorykit != []){
        this.mydb = new TurtleDB('example');
        this.mydb.read('kitting').then((doc) => {//console.log(doc)
          this.kit = doc.kit
          for (let i = 0; i <  this.kit.length; i++) {
            for (let k = 0; k < this.kit[i].kit_data.length; k++) {

          for (let j = 0; j < data.kit_data.length; j++) {
            if(this.kit[i].kit_data[k].item._id == data.kit_data[j].item._id){
              this.kit[i].kit_data[k].quantity=data.kit_data[j].quantity-data.kit_data[j].kit_item_qty

          }
        }
        }
        }
        console.log(this.kit)
        this.mydb.update('kitting', { kit: this.kit });
        console.log(       'kitting', { kit: this.kit }      )
        });
      

  
     
      }
      this.new = ({
        Cart: doc.data.Cart,
        Kits: this.itemhistorykit,
        status: true,
      })
      console.log(this.new)
      this.mydb = new TurtleDB('example');
      this.mydb.update('getitemlist', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, kitinfo: 2, updatestatus: 1, created_at: this.dateTime });
      for await (let kit of this.itemhistorykit) {
        //console.log(typeof kit.kit_status + ' ' + kit.kit_status)
        //console.log(typeof kit.kit_id._id + ' ' + kit.kit_id._id)
        //console.log(kit)
        if (kit.kit_status === 1 && kit.kit_id._id === data._id) {
          await this.takeNowKit.push(kit)
        }
      }

      await this.takeKit('kit')
    });

  }

  getData(obj) {

    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    if (window.navigator.onLine == true) {

      this.data = this.kit.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
      console.log(this.data)

    } else {
      this.onoff = false

      this.mydb = new TurtleDB('example');
      this.mydb.read('kitting').then((doc) => {//console.log(doc)
        this.kit = doc.kit
        this.data = doc.kit.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;

        });
        console.log(this.data)
      });

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
  listview() {

    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');
    asgrid.classList.add('as-list')
    asgridg.classList.remove('view-active')
    asgridl.classList.add('view-active')

  }
  gridview() {

    let asgrid = document.querySelector('.as-mt-main >.as-grid');
    let asgridg = document.querySelector('.as-g-active');
    let asgridl = document.querySelector('.as-l-active');

    asgrid.classList.remove('as-list')
    asgridg.classList.add('view-active')
    asgridl.classList.remove('view-active')
  }

  //************   Arunkumar  ***********************/
  async allDeviceInfo() {
    let response = await this.crud.get('machine/allDeviceInfo').pipe(untilDestroyed(this)).toPromise()
    //console.log(response)
    return response
  }

  async singleDeviceInfo(machine: any) {

    let response = await this.crud.post('machine/singleDeviceInfo', machine).pipe(untilDestroyed(this)).toPromise()
    //console.log(response)
    return response
  }
  // Sleep Function
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Format and Clean Objects
  async formatMachineData(item) {
    let machineData: any[] = []
    //console.log('*******  Format Data **********')
    //console.log(this.takeNowKit) 

    let i = 0
    this.takeNowKit[0].kit_item_details.forEach(async item => {
      if (item.alloted_item_qty_in_kit > 0) {
        let eachItemForMachines = {}
        eachItemForMachines['cart_id'] = this.takeNowKit[0].cart_id
        eachItemForMachines['kit_id'] = this.takeNowKit[0].kit_id._id
        eachItemForMachines['kit_cart_id'] = this.takeNowKit[0].kit_cart_id
        eachItemForMachines['item_id'] = item.item._id
        eachItemForMachines['kit_qty'] = this.takeNowKit[0].qty
        eachItemForMachines['qty'] = this.takeNowKit[0].kit_id.kit_data[i].qty
        // eachItemForMachines['qty'] = 1
        eachItemForMachines['stock_allocation_id'] = item._id
        eachItemForMachines['cube_id'] = item.cube.cube_id
        eachItemForMachines['column_id'] = item.bin.bin_id
        eachItemForMachines['bin_id'] = item.compartment.compartment_id
        eachItemForMachines['compartment_id'] = item.compartment_number
        await machineData.push(eachItemForMachines)
      }
      i++
    })
    return machineData

  }

  // GroupBy machineData by bin_id and column id
  async groupbyData(arr: any[]) {
    let helper = {};
    var result = arr.reduce(function (r: any[], o: { column_id: string; bin_id: string; compartment_id: any; }) {
      var key = o.column_id + '-' + o.bin_id;
      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      } else {
        helper[key].compartment_id = [o.compartment_id, helper[key].compartment_id]
      }
      return r;
    }, []);

    let i = 0
    for await (let item of result) {
      item.compartment_id = [item.compartment_id]
      result[i]['compartment_id'] = (((item.compartment_id.flat()).flat()).flat().flat()).flat()
      i++
    }
    return result
  }

  // filter successfully taken items from cartList take now
  // async fiterArray(cartList: any[], successTake: any[]) {
  //   //console.log(cartList)
  //   //console.log(successTake)
  //   let successTakeItems = await cartList.filter((x: { column_id: any; bin_id: any; }) => !successTake.find((y: { column_id: any; bin_id: any; }) => (y.column_id == x.column_id && y.bin_id == x.bin_id)))
  //   //console.log(successTakeItems)
  //   return successTakeItems
  // }
  async fiterArray(array, filter) {
    var myArrayFiltered: any[] = []
    let i = 0
    async function machine(array, filter) {
      for await (let filterId of filter) {
        for await (let arrayId of array) {
          if (filterId.column_id == arrayId.column_id && filterId.bin_id == arrayId.bin_id) {
            myArrayFiltered.push(arrayId)
            i++
          }
        }
      }
    }
    await machine(array, filter)
    return { item: myArrayFiltered, count: i }
  }
  // Take Items form machine  
  TakeOrReturnItems: any[] = []
  machinesList = []
  async takeKit(item: string) {

    //console.log(item)
    let totalMachinesList = await this.formatMachineData(item)
    //console.log(totalMachinesList)
    let machinesList = await this.groupbyData(totalMachinesList)
    //console.log(machinesList)
    //call allDevInfo once
    // await this.allDeviceInfo()
    // for loop for all machines lids
    let totalMachineUsage = []
    for await (let machine of machinesList) {
      // Record Total Machine Usage
      let eachColumnUsage = {}
      eachColumnUsage['cube_id'] = machine.cube_id
      eachColumnUsage['column_id'] = machine.column_id
      eachColumnUsage['bin_id'] = machine.bin_id
      eachColumnUsage['compartment_id'] = machine.compartment_id
      // Record Total Machine Usage
      let maxCompartmentNo = Math.max(...machine.compartment_id)
      machine['compartment_id'] = maxCompartmentNo
      //console.log('maxCompartmentNo')
      //console.log(maxCompartmentNo)
      let singleDeviceInfo = await this.singleDeviceInfo(machine)
      let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
      //console.log('Column : ' + machine.column_id + '' + 'drawer: ' + machine.bin_id + ' ' + 'Compartment: ' + machine.compartment_id)
      //console.log(status)
      this.machineCubeID = machine.cube_id
      this.machineColumnID = machine.column_id
      this.machineDrawID = machine.bin_id
      this.machineCompartmentID = machine.compartment_id
      this.machineStatus = status
      if (status == 'Locked' || status == 'Closed' || status == 'Unlocked' || status == 'Unknown') {
        // Lock that Column API, machine._id
        if (status == 'Closed' || status == 'Unlocked') {
          await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
          await this.sleep(1000)
        }

        // unlock Column API, machine._id, machine.column_id, machine.compartment_id
        await this.crud.post('machine/unlockBin', machine).pipe(untilDestroyed(this)).toPromise()
        // Record Total Machine Usage
        let t0 = performance.now();
        await this.sleep(10000)
        let apiHitTimes = 0
        let machineColumnStatus = false
        while (apiHitTimes < 15 && !machineColumnStatus) {
          //console.log('********************* API Hit Times ************** ' + machineColumnStatus)
          //console.log(' Machine Status : ' + machineColumnStatus)
          let singleDeviceInfo = await this.singleDeviceInfo(machine)
          let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
          this.machineStatus = status
          //console.log('inside while loop status bin ' + machine.bin_id +" "+ status)
          if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
            await this.sleep(9000)
            await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
            machineColumnStatus = true
            await this.TakeOrReturnItems.push(machine)
          }
          //Drawer current status, (opening, opened, closing, closed)
          else if (status !== 'Closed' && status !== 'Locked' && status == 'Unknown') {
            //console.log('Current Status = ' + status)
            this.machineStatus = status
            // this.msg='Current Status = ' + status

            // ColumnActionStatus = singleDeviceInfo
          }
          //set delay time
          await this.sleep(10000)
          if (status == 'Unlocked' && apiHitTimes == 14) {
            await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
          }
          apiHitTimes++
        }
        // if user does not closed after ceratin count of times API hit
        if (apiHitTimes == 10 && machineColumnStatus !== true) {
          //console.log('Application waiting time over for bin ' + machine.bin_id + 'in column ' + machine.column_id)

        }
        let t1 = performance.now();
        eachColumnUsage['column_usage'] = t1 - t0
        eachColumnUsage['company_id'] = this.permissions?.company_id?._id
        totalMachineUsage.push(eachColumnUsage)
        await this.sleep(5000)
      }
      // break for loop if single device info is unknown
      else {
        //console.log('Machine status unknown ' + status)
        this.msg = 'Machine status unknown ' + status
        //console.log('Close all drawers properly and click take now')
        this.msg = 'Close all drawers properly and click take now'
        break
      }
    }
    const successTake = await totalMachinesList.filter(array => this.TakeOrReturnItems.some(filter => filter.column_id === array.column_id && filter.bin_id === array.bin_id));
    // const failedTake = await totalMachinesList.filter(array => successTake.some(filter => JSON.stringify(filter.column_id) !== JSON.stringify(array.column_id) && JSON.stringify(filter.bin_id) !== JSON.stringify(array.bin_id)));
    const failedTake = await totalMachinesList.filter(({ stock_allocation_id: id1 }) => !successTake.some(({ stock_allocation_id: id2 }) => id1 === id2))
    //console.log(successTake)
    if (successTake.length == 0) {
      //console.log('Machine status unknown No Item taken')
      this.msgg = 'Machine status unknown No Item taken'
      this.dooropen = true
    } else if (successTake.length == totalMachinesList.length) {
      //console.log(successTake.length + ' Items Taken Successfully')
      this.msgg = successTake.length + ' Items Taken Successfully'
      await this.addMachineUsage(totalMachineUsage)
      await this.updateAfterTakeOrReturn(successTake, item, failedTake)
    } else if (successTake.length < totalMachinesList.length) {
      //console.log(successTake.length + ' Items Taken Successfully \n' + successTake.length + ' items failed return')
      await this.addMachineUsage(totalMachineUsage)
      await this.updateAfterTakeOrReturn(successTake, item, failedTake)
      this.msgg = successTake.length + ' Items Taken Successfully \n'

    }
  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake: any, item, failedTake: any) {
    if (window.navigator.onLine == true) {

      let data = {
        cart_id: this.id,
        take_items: successTake,
        untaken_or_returned_items: failedTake
      }
      if (item == 'cart') {
        data['cart_status'] = 2
      } else {
        data['kit_status'] = 2

      }
      this.crud.post(`cart/updateReturnTake`, data).pipe().subscribe(async (res) => {
        //console.log(res)
        this.dooropen = true
        if (res.status) {

          this.toast.success('Items Taken Successfully');

        }
      })
    } else {
      if( this.msgg != 'Machine status unknown No Item taken'){

      this.mydb = new TurtleDB('example');
      this.mydb.read('getitemlist').then(async (doc) => {
        console.log(doc)
        this.itemhistorykit = doc.data['Kits']
        // this.id = doc.data.Cart[0]['_id']
        this.dateTime = new Date();
  
        for (let k = 0; k < this.itemhistorykit.length; k++) {
          //console.log(typeof kit.kit_status + ' ' + kit.kit_status)
          //console.log(typeof kit.kit_id._id + ' ' + kit.kit_id._id)
          //console.log(kit)
          console.log(this.itemhistorykit[k].kit_id._id)
          this.kit_item_details = []
          if (this.itemhistorykit[k].kit_id._id === this.takenowdata._id) {
            for (let i = 0; i < this.itemhistorykit[k].kit_item_details.length; i++) {
              this.kit_item_details.push({
                active_status: this.itemhistorykit[k].kit_item_details[i].active_status,
                alloted_item_qty_in_kit: this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit,
                bin: this.itemhistorykit[k].kit_item_details[i].bin,
                category: this.itemhistorykit[k].kit_item_details[i].category,
                company_id: this.itemhistorykit[k].kit_item_details[i].company_id,
                compartment: this.itemhistorykit[k].kit_item_details[i].compartment,
                compartment_number: this.itemhistorykit[k].kit_item_details[i].compartment_number,
                created_at: this.itemhistorykit[k].kit_item_details[i].created_at,
                cube: this.itemhistorykit[k].kit_item_details[i].cube,
                deleted_at: this.itemhistorykit[k].kit_item_details[i].deleted_at,
                description: this.itemhistorykit[k].kit_item_details[i].description,
                item: this.itemhistorykit[k].kit_item_details[i].item,
                po_history: this.itemhistorykit[k].kit_item_details[i].po_history,
                purchase_order: this.itemhistorykit[k].kit_item_details[i].purchase_order,
                quantity: this.itemhistorykit[k].kit_item_details[i].quantity - this.itemhistorykit[k].kit_item_details[i].alloted_item_qty_in_kit,
                status: this.itemhistorykit[k].kit_item_details[i].status,
                sub_category: this.itemhistorykit[k].kit_item_details[i].sub_category,
                supplier: this.itemhistorykit[k].kit_item_details[i].supplier,
                total_quantity: this.itemhistorykit[k].kit_item_details[i].total_quantity,
                updated_at: this.itemhistorykit[k].kit_item_details[i].updated_at,
  
                _id: this.itemhistorykit[k].kit_item_details[i]._id,
  
              })
  
            }
            this.hlo = {
              cart_id: this.itemhistorykit[k].cart_id,
              created_at: this.dateTime,
              // kit_cart_id:  this.itemhistorykit[k].kit_cart_id,
              kit_id: this.itemhistorykit[k].kit_id,
              kit_item_details: this.kit_item_details,
              kit_name: this.itemhistorykit[k].kit_name,
              kit_status: 2,
              qty: 1,
              // update_kit_id:  this.itemhistorykit[k].update_kit_id,
              updated_at: this.dateTime
            }
  
  
          } else {
            this.kit_item_details = []
  
            for (let i = 0; i < this.takenowdata.kit_data.length; i++) {
              this.kit_item_details.push({
                active_status: this.takenowdata.kit_data[i].active_status,
                alloted_item_qty_in_kit: this.takenowdata.kit_data[i].kit_item_qty,
                bin: this.takenowdata.kit_data[i].bin,
                category: this.takenowdata.kit_data[i].category,
                company_id: this.takenowdata.kit_data[i].company_id,
                compartment: this.takenowdata.kit_data[i].compartment,
                compartment_number: this.takenowdata.kit_data[i].compartment_number,
                created_at: this.takenowdata.kit_data[i].created_at,
                cube: this.takenowdata.kit_data[i].cube,
                deleted_at: this.takenowdata.kit_data[i].deleted_at,
                description: this.takenowdata.kit_data[i].description,
                item: this.takenowdata.kit_data[i].item,
                po_history: this.takenowdata.kit_data[i].po_history,
                purchase_order: this.takenowdata.kit_data[i].purchase_order,
                quantity: this.takenowdata.kit_data[i].quantity - this.takenowdata.kit_data[i].kit_item_qty,
                status: this.takenowdata.kit_data[i].status,
                sub_category: this.takenowdata.kit_data[i].sub_category,
                supplier: this.takenowdata.kit_data[i].supplier,
                total_quantity: this.takenowdata.kit_data[i].total_quantity,
                updated_at: this.takenowdata.kit_data[i].updated_at,
  
                _id: this.takenowdata.kit_data[i]._id,
  
              }
  
              )
              console.log(this.kit_item_details)
  
  
  
            }
            this.hlo = {
              cart_id: doc.data['Cart'][0]._id,
              created_at: this.dateTime,
              // kit_cart_id:  this.itemhistorykit[k].kit_cart_id,
              kit_id: this.takenowdata._id,
              kit_item_details: this.kit_item_details,
  
  
              kit_name: this.takenowdata.kit_name,
              kit_status: 2,
              qty: 1,
              // update_kit_id:  this.itemhistorykit[k].update_kit_id,
              updated_at: this.dateTime
            }
  
  
          }
  
  
  
  
  
        }
        console.log(this.hlo)
        this.itemhistorykit.push(this.hlo)
        console.log(this.itemhistorykit)
        this.new = ({
          Cart: doc.data.Cart,
          Kits: this.itemhistorykit,
          status: true,
        })
        console.log(this.new)
        this.mydb = new TurtleDB('example');
        this.mydb.update('getitemlist', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, kitinfo: 2, updatestatus: 1, created_at: this.dateTime });
        this.toast.success('Items Taken Successfully');

      });

    }
  }
  }
  async addMachineUsage(data) {
    if (window.navigator.onLine == true) {

      console.log(data)
      this.crud.post(`dashboard/machineUsageAdd`, data).pipe().subscribe(async (res) => {
        //console.log(res)
        if (res) {
          // this.toast.success('machine Usage Added Successfully...');
        }
      })
    } else {
      console.log(data)
    }
  }


  // machinesList = [
  //   {
  //     column_id: 1,
  //     bin_id: 1,
  //     compartment_id: 5
  //   },
  //   {
  //     column_id: 1,
  //     bin_id: 1,
  //     compartment_id: 5
  //   },
  //   {
  //     column_id: 1,
  //     bin_id: 3,
  //     compartment_id: 5
  //   },
  //   {
  //     column_id: 1,
  //     bin_id: 4,
  //     compartment_id: 5
  //   },
  //   {
  //     column_id: 1,
  //     bin_id: 5,
  //     compartment_id: 5
  //   },
  // ]
  // machineColumnStatus


  ngOnDestroy() { }
}



