import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import TurtleDB from 'turtledb';
declare const window: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [NgbModal]
})
export class DetailsComponent implements OnInit {
  items: any = [];
  machine: any = [];
  cube: any = [];
  bin: any = [];
  compartment: any = [];
  it: any;
  qty: any;
  id: any;
  qut: number;
  message: any = [];


  @ViewChild('videoPlayer') videoplayer: ElementRef;
  public startedPlay: boolean = false;
  public show: boolean = false;
  videoSource = "";
  videoform: FormGroup;
  cartList1: any = [];
  cartdata1: any = [];
  status: any;
  machineCubeID: any;
  machineDrawID: any;
  machinebinID: any;
  machineColumnID: any;
  machineStatus: any;
  machineCompartmentID: any;
  myThumbnail = "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  myFullresImage = "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  msg: string;
  massage: string;
  msgg: string;
  mainimage: any;
  img: boolean = true;
  permissions: any;
  totalquantity: any = [];
  dooropen: boolean = false;
  mydb: any;
  cart: any = [];
  cartList2: any = [];
  onoff: boolean;
  cartnew: any = [];
  newcd: any = [];
  fcd: any;
  samearray: any = [];
  hlo: any = []
  newcart: any;
  newcartdata: any = [];
  new: { cart: any; total_quantity: any; _id: any; };
  constructor(public router: Router, private toast: ToastrService, private fb: FormBuilder, public crud: CrudService,
    public modalService: NgbModal) {


  }
  ngOnInit(): void {
    this.permissions = JSON.parse(localStorage.getItem("personal"))
    if (window.navigator.onLine == true) {
      this.onoff = true
      this.crud.CurrentMessage3.subscribe((message: any) => {
        console.log(message)
        //console.log(localStorage.getItem("_id"))
        if (message != "" && !localStorage.getItem("hlo")) {

          let params: any = {};
          params['company_id'] = this.permissions?.company_id?._id
          this.message = message
          console.log(this.message)
          this.crud.get1(appModels.DETAILS + this.message, { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
            console.log(res)
            this.status = res.status
            localStorage.setItem("hlo", "data")
            this.items = res.items
            this.videoSource = this.items.video_path
            this.mainimage = this.items.image_path[0]
            console.log(this.items.video_path)
            this.machine = res.machine
            this.it = this.machine.item
            this.qty = this.machine.quantity
            console.log(this.it)
            this.cube = this.machine.cube
            this.bin = this.machine.bin
            this.compartment = this.machine.compartment

          })
        }
        else {

          let params: any = {};
          params['company_id'] = this.permissions?.company_id?._id
          this.crud.get1(appModels.DETAILS + localStorage.getItem("ids"), { params }).pipe(untilDestroyed(this)).subscribe((res: any) => {
            console.log(res)
            this.status = res.status
            localStorage.setItem("hlo", "data")
            this.items = res.items
            this.videoSource = this.items.video_path
            this.mainimage = this.items.image_path[0]
            console.log(this.items.video_path)
            this.machine = res.machine
            this.it = this.machine.item
            this.qty = this.machine.quantity
            console.log(this.it)
            this.cube = this.machine.cube
            this.bin = this.machine.bin
            this.compartment = this.machine.compartment

          })
        }
      })
    } else {
      this.onoff = false
      this.crud.CurrentMessage3.subscribe((message: any) => {
        console.log(message)
        this.message = message
        this.mydb = new TurtleDB('example');
        this.mydb.read('detailpage').then((doc) => {
          console.log(doc)
          for (let i = 0; i < doc.data?.length; i++) {
            console.log("oi", doc.data[i].productdetails.items._id, this.message)
            if (this.message == doc.data[i].productdetails.items._id) {
              this.items = doc.data[i].productdetails.items
              this.machine = doc.data[i].productdetails.machine
              this.videoSource = this.items.video_path
              this.mainimage = this.items.image_path[0]
              this.qty = this.machine.quantity
              console.log(this.items, this.machine)
            }
          }
        })

      });

      // this.mydb.read('machine').then((doc) =>{console.log(doc)
      //   this.machine = doc.data
      //   console.log(this.items)

      // } );
    }

  }
  changing(event) {

    console.log(event.target.value)
    if (this.qty >= event.target.value) {
      this.qut = event.target.value
    } else {
      (<HTMLInputElement>document.getElementById(event.target.id)).value = "";
      this.qut = 0
      this.toast.error("You have reached maximum quantity of the item.")
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
  async addtocart(item?) {
    if (window.navigator.onLine == true) {
      if (this.qut && this.qut > 0) {
        let cart = {
          "item": this.machine.item,
          "total_quantity": Number(this.qut),
          "company_id": this.permissions?.company_id?._id
        }
        console.log(this.machine)
        this.crud.post(appModels.ADDTOCART, cart).subscribe(async res => {
          console.log(res)

          if (res['message'] == "Successfully added into cart!") {
            let params: any = {};
            params['user_id'] = this.permissions?._id
            params['company_id'] = this.permissions?.company_id?._id

            this.crud.get1(appModels.listCart, { params }).pipe(untilDestroyed(this)).subscribe(async res => {
              console.log(res)
              if (res) {
                if (!item) {
                  this.toast.success("cart added successfully")
                  this.cartList1 = [];
                  this.crud.get1(appModels.listCart, { params }).pipe(untilDestroyed(this)).subscribe(async res => {

                    this.cartdata1 = res[0]
                    console.log(this.cartdata1.cart)
                    for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                      if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                        this.cartList1.push(this.cartdata1?.cart[i])
                      }
                    }
                    console.log(this.cartList1)
                    this.crud.getcarttotal(this.cartList1?.length)
                    this.router.navigate(['pages/details'])

                  })
                }
                if (item) {
                  // /log/getUserTakenQuantity?user_id&item_id
                  let params: any = {};
                  params['company_id'] = this.permissions?.company_id?._id
                  params['user_id'] = this.permissions?._id
                  this.crud.get1("log/getUserTakenQuantity", { params }).pipe(untilDestroyed(this)).subscribe(async res => {
                    console.log(res)
                    if (res?.data?.length != 0) {
                      this.totalquantity = res['data']
                      this.totalquantity.trasaction_qty

                      if (this.permissions?.item_max_quantity >= this.totalquantity[0]?.trasaction_qty + this.qut) {
                        this.dooropen = false;
                        this.modalService.open(item, { backdrop: false, keyboard: false });
                        this.cartList = [];
                        this.crud.get1(appModels.listCart, { params }).pipe(untilDestroyed(this)).subscribe(async res => {
                          console.log(res)
                          this.toast.success("Door open Sucessfully")
                          this.cartdata = res[0]
                          for (let i = 0; i < this.cartdata?.cart?.length; i++) {
                            if (this.cartdata?.cart[i]['cart_status'] == 1 && this.cartdata?.cart[i]['item']['_id'] == this.machine.item) {
                              this.cartList.push(this.cartdata?.cart[i])
                            }
                          }
                          console.log(this.cartList)
                          await this.takeItem(item)
                          this.crud.getcarttotal(this.cartList?.length)
                        }, error => {
                          this.toast.error(error.message);
                        })
                      } else {
                        this.toast.error("You have exceeded item maximum quantity taken per day.")
                      }

                    } else {

                      if (this.permissions?.item_max_quantity >= 0 + this.qut) {
                        this.dooropen = false;
                        this.modalService.open(item, { backdrop: false, keyboard: false });
                        this.cartList = [];
                        this.crud.get1(appModels.listCart, { params }).pipe(untilDestroyed(this)).subscribe(async res => {
                          console.log(res)
                          this.toast.success("Door open Sucessfully")
                          this.cartdata = res[0]
                          for (let i = 0; i < this.cartdata?.cart?.length; i++) {
                            if (this.cartdata?.cart[i]['cart_status'] == 1 && this.cartdata?.cart[i]['item']['_id'] == this.machine.item) {
                              this.cartList.push(this.cartdata?.cart[i])
                            }
                          }
                          console.log(this.cartList)
                          await this.takeItem(item)
                          this.crud.getcarttotal(this.cartList?.length)
                        }, error => {
                          this.toast.error(error.message);
                        })
                      } else {
                        this.toast.error("You have exceeded item maximum quantity taken per day.")
                      }

                    }

                  })

                }
                //Arunkumar

              }

            }, error => {
              this.toast.error(error.message);
            })

          } else if (res['message'] == "Stock Not Yet Allocated") {
            this.toast.error(res['message'])
          }
          //this.toast.success("cart added successfully")

        })

      } else {
        this.toast.error("Please Enter Valid QTY")
      }

    }
    //offline
    else {
      if (this.qut && this.qut > 0) {
        //addtocart
        if (!item) {
          this.mydb = new TurtleDB('example');
          this.mydb.read('getlistcart').then((doc) => {
            console.log(doc)
            this.cartdata1 = doc.data
            this.cartList1 = [];
            let tempArray = [];

            this.newcart = this.cartdata1.cart
            console.log(this.newcart)
            const checkid = this.newcart.some(item => item.item._id === this.machine.item && item.cart_status === 1)

            //const checkstatus = this.newcart.some(item => item.cart_status === 1) && checkstatus == true
            console.log(checkid)
            if (checkid == true) {

              //console.log(this.machine.item)
              let mechine_id = this.machine.item
              let qut = this.qut
              const newcartdata = this.newcart.filter(function (newcart) {
                return newcart.item._id == mechine_id && newcart.cart_status == 1 ? newcart.qty = Number(qut) + Number(newcart.qty) : newcart;

              })
              console.log(newcartdata)
              //  if(newcartdata){
              //   this.newcd = this.cartdata1.cart.filter((item) => item.item.id !== mechine_id && item.cart_status ==1);
              //   console.log(this.newcd)
              //  }

              for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                  this.cartList1.push(this.cartdata1?.cart[i])
                  let hi = this.cartList1.reduce((accumulator, current) => accumulator + current.qty, 0);
                  console.log(hi)
                  doc.data.total_quantity = hi

                }
              }
              this.new = ({
                cart: newcartdata,
                total_quantity: doc.data.total_quantity,
                _id: doc.data._id
              })
              console.log(this.new)
              const dateTime = new Date();
              this.mydb = new TurtleDB('example');
              this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:2, created_at: dateTime });
              this.toast.success("cart added successfully")


            } else {
              const dateTime = new Date();
              this.hlo = {
                allocation: this.machine._id,
                cart_status: 1,
                item: {
                  image_path: this.items.image_path,
                  item_name: this.items.item_name,
                  _id: this.machine.item,
                //  image: "",
                },
                item_details: this.machine,

                qty: Number(this.qut),
              }
              // console.log(this.hlo)
              this.newcart.push(this.hlo)
              //  console.log(this.newcart)

              for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                  this.cartList1.push(this.cartdata1?.cart[i])
                  let hi = this.cartList1.reduce((accumulator, current) => accumulator + current.qty, 0);
                  console.log(hi)
                  doc.data.total_quantity = hi
                }
              }
              this.new = ({
                cart: this.newcart,
                total_quantity: doc.data.total_quantity,
                _id: doc.data._id
              })
              console.log(this.new)
              this.mydb = new TurtleDB('example');
              this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:1, created_at: dateTime });
              this.toast.success("cart added successfully")

            }





            console.log(this.cartList1)

            this.crud.getcarttotal(this.cartList1?.length)
            this.router.navigate(['pages/details'])
          });
        }
        //takenow
        if (item) {
          this.mydb = new TurtleDB('example');
          this.mydb.read('getUserTakenQuantity').then(async (doc) => {
            console.log(doc)
            const res = doc.data
            if (res?.data?.length != 0) {
              this.totalquantity = res['data']
              console.log(this.permissions?.item_max_quantity >= this.totalquantity[0]?.trasaction_qty + this.qut, this.permissions?.item_max_quantity, this.totalquantity[0]?.trasaction_qty + this.qut)
              if (this.permissions?.item_max_quantity >= this.totalquantity[0]?.trasaction_qty + this.qut) {
                this.dooropen = false;
                this.modalService.open(item, { backdrop: false, keyboard: false });
                // this.cartList = [];
                // this.crud.get1(appModels.listCart,{params}).pipe(untilDestroyed(this)).subscribe(async res => {
                //   console.log(res)
                //   this.toast.success("Door open Sucessfully")
                //   this.cartdata = res[0]
                //   for (let i = 0; i < this.cartdata?.cart?.length; i++) {
                //     if (this.cartdata?.cart[i]['cart_status'] == 1 && this.cartdata?.cart[i]['item']['_id'] == this.machine.item) {
                //       this.cartList.push(this.cartdata?.cart[i])
                //     }
                //   }
                //   console.log(this.cartList)
                //   await this.takeItem(item)
                //   this.crud.getcarttotal(this.cartList?.length)
                // }, error => {
                //   this.toast.error(error.message);
                // })
                this.mydb = new TurtleDB('example');
                this.mydb.read('getlistcart').then((doc) => {
                  console.log(doc)
                  this.cartdata1 = doc.data
                  this.cartList1 = [];
                  let tempArray = [];
                  this.newcart = this.cartdata1.cart
                  console.log(this.newcart)
                  const checkid = this.newcart.some(item => item.item._id === this.machine.item && item.cart_status === 2)

                 // const checkstatus = this.newcart.some(item => item.cart_status === 2) && checkstatus == true
                  console.log(checkid)
                  if (checkid == true) {

                    let mechine_id = this.machine.item
                    let qut = this.qut
                    const newcartdata = this.newcart.filter(function (newcart) {
                      return newcart.item._id == mechine_id && newcart.cart_status == 2 ? (newcart.item_details.quantity = Number(newcart.item_details.quantity) - Number(qut)) && (newcart.qty = Number(qut) + Number(newcart.qty)) : newcart;

                    })
                    console.log(newcartdata)

                    this.new = ({
                      cart: newcartdata,
                      total_quantity: doc.data.total_quantity,
                      _id: doc.data._id
                    })
                    for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                      if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                        this.cartList1.push(this.cartdata1?.cart[i])
                        doc.data.total_quantity = this.cartdata1?.cart[i].qty

                      }
                    }
                    const dateTime = new Date();
                    this.mydb = new TurtleDB('example');
                    this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:2, created_at: dateTime });
                    this.toast.success("Door open Sucessfully")


                  } else {
                    const dateTime = new Date();
                    this.hlo = {
                      allocation: this.machine._id,
                      cart_status: 2,
                      item: {
                        image_path: this.items.image_path,
                        item_name: this.items.item_name,
                        _id: this.machine.item,
                      //  image: "",
                      },
                      item_details: {
                        active_status: this.machine.active_status,
                        bin: this.machine.bin,
                        category: this.machine.category,
                        company_id: this.machine.company_id,
                        compartment: this.machine.compartment,
                        compartment_number: this.machine.compartment_number,
                        created_at: this.machine.created_at,
                        cube: this.machine.cube,
                        deleted_at: this.machine.deleted_at,
                        description: this.machine.description,
                        item: this.machine.item,
                        po_history: this.machine.po_history,
                        purchase_order: this.machine.purchase_order,
                        quantity: Number(this.machine.quantity) - Number(this.qut),
                        status: this.machine.status,
                        sub_category: this.machine.sub_category,
                        supplier: this.machine.supplier,
                        total_quantity: this.machine.total_quantity,
                        updated_at: this.machine.updated_at,

                        _id: this.machine._id,
                      },

                      qty: Number(this.qut),
                    }
                    console.log(this.hlo)
                    this.newcart.push(this.hlo)
                    console.log(this.newcart)
                    this.new = ({
                      cart: this.newcart,
                      total_quantity: doc.data.total_quantity,
                      _id: doc.data._id
                    })
                    for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                      if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                        this.cartList1.push(this.cartdata1?.cart[i])
                        doc.data.total_quantity = this.cartdata1?.cart[i].qty

                      }
                    }
                    this.mydb = new TurtleDB('example');
                    this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:1, created_at: dateTime });
                    this.toast.success("Door open Sucessfully")

                  }

                  console.log(this.cartList1)

                  this.crud.getcarttotal(this.cartList1?.length)
                });              
                  await this.takeItem(item)
              } else {
                this.toast.error("You have exceeded item maximum quantity taken per day.")
              }

            } else {
              console.log(this.permissions?.item_max_quantity >= 0 + this.qut, this.permissions?.item_max_quantity, 0 + this.qut)
              if (this.permissions?.item_max_quantity >= 0 + this.qut) {
                this.dooropen = false;
                this.modalService.open(item, { backdrop: false, keyboard: false });
                this.mydb = new TurtleDB('example');
                this.mydb.read('getlistcart').then((doc) => {
                  console.log(doc)
                  this.cartdata1 = doc.data
                  this.cartList1 = [];
                  let tempArray = [];
                  this.newcart = this.cartdata1.cart
                  console.log(this.newcart)
                  const checkid = this.newcart.some(item => item.item._id === this.machine.item &&  item.cart_status === 2)

                  //const checkstatus = this.newcart.some(item => item.cart_status === 2)
                  console.log(checkid)
                  if (checkid == true ) {

                    let mechine_id = this.machine.item
                    let qut = this.qut
                    const newcartdata = this.newcart.filter(function (newcart) {
                      return newcart.item._id == mechine_id && newcart.cart_status == 2 ? (newcart.item_details.quantity = Number(newcart.item_details.quantity) - Number(qut)) && (newcart.qty = Number(qut) + Number(newcart.qty)) : newcart;

                    })
                    console.log(newcartdata)

                    this.new = ({
                      cart: newcartdata,
                      total_quantity: doc.data.total_quantity,
                      _id: doc.data._id
                    })
                    for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                      if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                        this.cartList1.push(this.cartdata1?.cart[i])
                        doc.data.total_quantity = this.cartdata1?.cart[i].qty

                      }
                    }
                    const dateTime = new Date();
                    this.mydb = new TurtleDB('example');
                    this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:2, created_at: dateTime });
                    this.toast.success("Door open Sucessfully")


                  } else {
                    const dateTime = new Date();
                    this.hlo = {
                      allocation: this.machine._id,
                      cart_status: 2,
                      item: {
                        image_path: this.items.image_path,
                        item_name: this.items.item_name,
                        _id: this.machine.item,
                       // image: "",
                      },
                      item_details: {
                        active_status: this.machine.active_status,
                        bin: this.machine.bin,
                        category: this.machine.category,
                        company_id: this.machine.company_id,
                        compartment: this.machine.compartment,
                        compartment_number: this.machine.compartment_number,
                        created_at: this.machine.created_at,
                        cube: this.machine.cube,
                        deleted_at: this.machine.deleted_at,
                        description: this.machine.description,
                        item: this.machine.item,
                        po_history: this.machine.po_history,
                        purchase_order: this.machine.purchase_order,
                        quantity: Number(this.machine.quantity) - Number(this.qut),
                        status: this.machine.status,
                        sub_category: this.machine.sub_category,
                        supplier: this.machine.supplier,
                        total_quantity: this.machine.total_quantity,
                        updated_at: this.machine.updated_at,

                        _id: this.machine._id,
                      },

                      qty: Number(this.qut),
                    }
                    console.log(this.hlo)
                    this.newcart.push(this.hlo)
                    console.log(this.newcart)
                    this.new = ({
                      cart: this.newcart,
                      total_quantity: doc.data.total_quantity,
                      _id: doc.data._id
                    })
                    for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
                      if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                        this.cartList1.push(this.cartdata1?.cart[i])
                        doc.data.total_quantity = this.cartdata1?.cart[i].qty

                      }
                    }
                    this.mydb = new TurtleDB('example');
                    this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:1, created_at: dateTime });
                    this.toast.success("Door open Sucessfully")

                  }

                  console.log(this.cartList1)

                  this.crud.getcarttotal(this.cartList1?.length)
                });
                await this.takeItem(item)
              } else {
                this.toast.error("You have exceeded item maximum quantity taken per day.")
              }

            }
          })


        }

      } else {
        this.toast.error("Please Enter Valid QTY")
      }

    }




  }
  cartList
  cartdata

  // async getCartItems() {
  //   this.cartList = [];
  //   this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
  //     console.log(res)
  //     this.cartdata = res[0]
  //     for (let i = 0; i < this.cartdata?.cart?.length; i++) {
  //       if (this.cartdata?.cart[i]['cart_status'] == 1 && this.cartdata?.cart[i]['item']['_id'] == this.machine.item) {
  //         this.cartList.push(this.cartdata?.cart[i])
  //       }
  //     }
  //     console.log(this.cartList)
  //     this.crud.getcarttotal(this.cartList?.length)
  //   }, error => {
  //     this.toast.error(error.message);
  //   })
  // }

  //}
  showimg(value) {
    console.log(value)
    this.img = true
    this.mainimage = value
  }
  //************   Arunkumar  ***********************/
  async allDeviceInfo() {
    let response = await this.crud.get('machine/allDeviceInfo').pipe(untilDestroyed(this)).toPromise()
    console.log(response)
    return response
  }

  async singleDeviceInfo(machine: any) {

    let response = await this.crud.post('machine/singleDeviceInfo', machine).pipe(untilDestroyed(this)).toPromise()
    console.log(response)
    return response
  }
  // Sleep Function
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Format and Clean Objects
  async formatMachineData(item) {
    let machineData: any[] = []
    console.log('*******  Format Data **********')
    this.cartList.forEach(async item => {
      let eachItemForMachines = {}
      eachItemForMachines['cart_id'] = item._id
      eachItemForMachines['item_id'] = item.item._id
      eachItemForMachines['qty'] = this.qut
      eachItemForMachines['stock_allocation_id'] = item.item_details._id
      eachItemForMachines['cube_id'] = item.item_details.cube.cube_id
      eachItemForMachines['column_id'] = item.item_details.bin.bin_id
      eachItemForMachines['bin_id'] = item.item_details.compartment.compartment_id
      eachItemForMachines['compartment_id'] = item.item_details.compartment_number
      await machineData.push(eachItemForMachines)
    });

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
  //   console.log(cartList)
  //   console.log(successTake)
  //   let successTakeItems = await cartList.filter((x: { column_id: any; bin_id: any; }) => !successTake.find((y: { column_id: any; bin_id: any; }) => (y.column_id == x.column_id && y.bin_id == x.bin_id)))
  //   console.log(successTakeItems)
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
  async takeItem(item: string) {
    // this.machineCubeID = []
    // this.machineColumnID =[]
    // this.machineDrawID =[]
    // this.machineCompartmentID = []
    // this.machineStatus = []
    // this.msg=""
    // this.msgg=""
    console.log('******** Machine Into *********')

    // await this.addtocart()
    // await this.getCartItems()
    let totalMachinesList = await this.formatMachineData(item)
    console.log(totalMachinesList)
    let machinesList = await this.groupbyData(totalMachinesList)
    console.log(machinesList)
    //call allDevInfo once
    // await this.allDeviceInfo()
    // for loop for all machines lids

    // Record Total Machine Usage
    let totalMachineUsage = []
    for await (let machine of machinesList) {
      console.log('******** Machine Into *********')
      // Record Total Machine Usage
      let eachColumnUsage = {}
      eachColumnUsage['cube_id'] = machine.cube_id
      eachColumnUsage['column_id'] = machine.column_id
      eachColumnUsage['bin_id'] = machine.bin_id
      eachColumnUsage['compartment_id'] = machine.compartment_id
      // Record Total Machine Usage

      let maxCompartmentNo = Math.max(...machine.compartment_id)
      machine['compartment_id'] = maxCompartmentNo
      console.log('maxCompartmentNo')
      console.log(maxCompartmentNo)
      let singleDeviceInfo = await this.singleDeviceInfo(machine)
      let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
      console.log('Column : ' + machine.column_id + '' + 'drawer: ' + machine.bin_id + ' ' + 'Compartment: ' + machine.compartment_id)
      console.log(status)
      this.machineCubeID = machine.cube_id
      this.machineColumnID = machine.column_id
      this.machineDrawID = machine.bin_id
      this.machineCompartmentID = machine.compartment_id
      this.machineStatus = status
      if (status == 'Locked' || status == 'Closed' || status == 'Unlocked' || status == 'Unknown') {
        // Lock that Column API, machine._id
        if (status == 'Closed' || status == 'Unlocked') {
          await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
          await this.sleep(5000)
        }

        // unlock Column API, machine._id, machine.column_id, machine.compartment_id
        await this.crud.post('machine/unlockBin', machine).pipe(untilDestroyed(this)).toPromise()
        // Record Total Machine Usage
        let t0 = performance.now();

        await this.sleep(10000)
        let apiHitTimes = 0
        let machineColumnStatus = false
        while (apiHitTimes < 15 && !machineColumnStatus) {
          console.log('********************* API Hit Times ************** ' + machineColumnStatus)
          console.log(' Machine Status : ' + machineColumnStatus)
          let singleDeviceInfo = await this.singleDeviceInfo(machine)
          let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
          this.machineStatus = status
          console.log('inside while loop status bin ' + machine.bin_id + status)
          if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
            await this.sleep(9000)
            await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
            machineColumnStatus = true
            await this.TakeOrReturnItems.push(machine)
          }
          //Drawer current status, (opening, opened, closing, closed)
          else if (status !== 'Closed' && status !== 'Locked' && status != 'Unknown') {
            console.log('Current Status = ' + status)
            // this.msg = 'Current Status = ' + status
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
        if (apiHitTimes == 15 && machineColumnStatus !== true) {
          console.log('Application waiting time over for bin ' + machine.bin_id + 'in column ' + machine.column_id)

        }
        let t1 = performance.now();
        eachColumnUsage['column_usage'] = t1 - t0
        eachColumnUsage['company_id'] = this.permissions?.company_id?._id
        totalMachineUsage.push(eachColumnUsage)
        await this.sleep(5000)
      }
      // break for loop if single device info is unknown
      else {
        console.log('Machine status unknown ' + status)
        this.msg = 'Machine status unknown ' + status
        console.log('Close all drawers properly and click take now')
        this.msg = 'Close all drawers properly and click take now'
        break
      }
    }
    const successTake = await totalMachinesList.filter(array => this.TakeOrReturnItems.some(filter => filter.column_id === array.column_id && filter.bin_id === array.bin_id));

    console.log(successTake)
    if (successTake.length == 0) {
      console.log('Machine status unknown No Item taken')
      this.msgg = 'Machine status unknown No Item taken'
      this.dooropen = true
    } else if (successTake.length == totalMachinesList.length) {
      console.log(successTake.length + ' Items Taken Successfully')
      this.msgg = successTake.length + ' Items Taken Successfully'
      await this.addMachineUsage(totalMachineUsage)
      await this.updateAfterTakeOrReturn(successTake, item)
    } else if (successTake.length < totalMachinesList.length) {
      console.log(successTake.length + ' Items Taken Successfully \n' + successTake.length + ' items failed return')
      this.msgg = successTake.length + ' Items Taken Successfully \n'
      await this.addMachineUsage(totalMachineUsage)
      await this.updateAfterTakeOrReturn(successTake, item)

    }
  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake: any, item?) {
    if (window.navigator.onLine == true) {

      let data = {
        cart_id: this.cartdata._id,
        take_items: successTake,
        cart_status: 2
      }
      this.crud.post(`cart/updateReturnTake`, data).pipe().subscribe(async (res) => {
        console.log(res)
        if (res) {
          this.toast.success('Item Taken Successfully...');
          this.dooropen = true

        }
      })
    } else {
      if( this.msgg != 'Machine status unknown No Item taken'){
        this.mydb = new TurtleDB('example');
        this.mydb.read('getlistcart').then((doc) => {
          console.log(doc)
          this.cartdata1 = doc.data
          this.cartList1 = [];
          let tempArray = [];
          this.newcart = this.cartdata1.cart
          console.log(this.newcart)
          const checkid = this.newcart.some(item => item.item._id === this.machine.item &&  item.cart_status === 2)

          //const checkstatus = this.newcart.some(item => item.cart_status === 2)
          console.log(checkid)
          if (checkid == true ) {

            let mechine_id = this.machine.item
            let qut = this.qut
            const newcartdata = this.newcart.filter(function (newcart) {
              return newcart.item._id == mechine_id && newcart.cart_status == 2 ? (newcart.item_details.quantity = Number(newcart.item_details.quantity) - Number(qut)) && (newcart.qty = Number(qut) + Number(newcart.qty)) : newcart;

            })
            console.log(newcartdata)

            this.new = ({
              cart: newcartdata,
              total_quantity: doc.data.total_quantity,
              _id: doc.data._id
            })
            for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
              if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                this.cartList1.push(this.cartdata1?.cart[i])
                doc.data.total_quantity = this.cartdata1?.cart[i].qty

              }
            }
            const dateTime = new Date();
            this.mydb = new TurtleDB('example');
            this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:2, created_at: dateTime });


          } else {
            const dateTime = new Date();
            this.hlo = {
              allocation: this.machine._id,
              cart_status: 2,
              item: {
                image_path: this.items.image_path,
                item_name: this.items.item_name,
                _id: this.machine.item,
               // image: "",
              },
              item_details: {
                active_status: this.machine.active_status,
                bin: this.machine.bin,
                category: this.machine.category,
                company_id: this.machine.company_id,
                compartment: this.machine.compartment,
                compartment_number: this.machine.compartment_number,
                created_at: this.machine.created_at,
                cube: this.machine.cube,
                deleted_at: this.machine.deleted_at,
                description: this.machine.description,
                item: this.machine.item,
                po_history: this.machine.po_history,
                purchase_order: this.machine.purchase_order,
                quantity: Number(this.machine.quantity) - Number(this.qut),
                status: this.machine.status,
                sub_category: this.machine.sub_category,
                supplier: this.machine.supplier,
                total_quantity: this.machine.total_quantity,
                updated_at: this.machine.updated_at,

                _id: this.machine._id,
              },

              qty: Number(this.qut),
            }
            console.log(this.hlo)
            this.newcart.push(this.hlo)
            console.log(this.newcart)
            this.new = ({
              cart: this.newcart,
              total_quantity: doc.data.total_quantity,
              _id: doc.data._id
            })
            for (let i = 0; i < this.cartdata1?.cart?.length; i++) {
              if (this.cartdata1?.cart[i]['cart_status'] == 1) {
                this.cartList1.push(this.cartdata1?.cart[i])
                doc.data.total_quantity = this.cartdata1?.cart[i].qty

              }
            }
            this.mydb = new TurtleDB('example');
            this.mydb.update('getlistcart', { data: this.new, user: this.permissions?._id, company_id: this.permissions?.company_id?._id, cartinfo: 2,updatestatus:1, created_at: dateTime });
           // this.toast.success("Door open Sucessfully")

          }
          this.toast.success('Item Taken Successfully...');
          this.dooropen = true
          console.log(this.cartList1)

          this.crud.getcarttotal(this.cartList1?.length)
        });
      }

    }
  }
  async addMachineUsage(data) {
    if (window.navigator.onLine == true) {

      console.log(data)
      this.crud.post(`dashboard/machineUsageAdd`, data).pipe().subscribe(async (res) => {
        console.log(res)
        if (res) {
          // this.toast.success('machine Usage Added Successfully...');
        }
      })
    } else {
      console.log(data)
    }
  }




  pauseVideo(videoplayer) {
    this.videoplayer.nativeElement.pause();
    setTimeout(() => {
      this.videoplayer.nativeElement.pause();
      if (videoplayer.nativeElement.paused) {
        this.show = !this.show;
      }
    }, 5000);


  }


  // closebutton(videoplayer) {
  //   this.show = !this.show;
  //   videoplayer.nativeElement.play();
  // }
  toggleVideo() {
    this.img = false;
    this.videoplayer.nativeElement.play();
  }
  ngOnDestroy() {
    localStorage.removeItem("allow1")
  }
}
