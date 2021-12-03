import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs/operators';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.scss']
})
export class MycartComponent implements OnInit {

  cartDetails: any[] = [];
  cartList: any = [];
  cartIds: any[] = [];
  selected3: any[] = [];
  page = 0;
  size = 4;
  cartdata: any = [];
  machinedetails: any = [];
  val: any = [];



  @Input() products: any[];
  @Output() productAdded = new EventEmitter();
  item_details: any;
  machineCubeID: any;
  machineColumnID: any;
  machineDrawID: any;
  machineCompartmentID: any;
  machineStatus: any;
  message: string;
  msgg: string;
  msg: string;
  category: any;
  permissions : any=[];
  totalquantity: any=[];
  qtys: number;
  val1: any;
  val2: any;
  constructor(private crudService: CrudService,
    private toast: ToastrService, public cookie: CookieService,public router:Router,
    public modalService: NgbModal) { }

  ngOnInit(): void {
    this.permissions=JSON.parse(localStorage.getItem("personal"))
    this.getCartItems();
    // this.takeItems()
  }
  getCartItems() {
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions._id
    this.crudService.get1(appModels.listCart,{params}).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.item_details = res.item_details
      console.log(this.item_details)
      this.cartdata = res[0]
      this.cartList = [];
      for (let i = 0; i < this.cartdata?.cart?.length; i++) {
        if (this.cartdata?.cart[i]['cart_status'] == 1) {
          this.cartList.push(this.cartdata?.cart[i])
        }
      }
      console.log(this.cartList[0]?.qty)
      console.log(this.cartList[0]?.item_details?.quantity)
      this.crudService.getcarttotal(this.cartList?.length)
    }, error => {
      this.toast.error(error.message);
    })
    
  }
  
  
  updateCart(cart, qty,maxqty) {
    localStorage.removeItem("onetimecall")
    this.val1=maxqty
    this.val2=qty
    setTimeout(() => {
      if(this.val2>=this.val1){
        this.val2 = this.val1
      }
 
      let data = {
        "item": cart.item._id,
        "allocation": cart.allocation,
        "qty":this.val2==0?1:this.val2,
        "cart_id": this.cartdata['_id'],
        "company_id":this.permissions?.company_id?._id
      }
      this.method(data)
    
    }, 10000);
     }
  method(data) {
if(!localStorage.getItem("onetimecall")){
  localStorage.setItem("onetimecall","val")
  this.crudService.update2(appModels.updateCart, data).pipe(untilDestroyed(this)).subscribe(res => {
    console.log(res)
    this.toast.success(res.message);
    this.getCartItems();
  }, error => {
    this.toast.error(error.message);
  })
}
}

  deleteCart(cart) {
    if (confirm(`Are you sure, you want to Delete?`)) {
      let data = {
        "cart_id": this.cartdata['_id'],
        "item_id": [cart.item._id],
        "company_id": this.permissions?.company_id?._id
      }
      this.crudService.update2('cart/deleteItemFromCart', data).pipe(untilDestroyed(this)).subscribe(res => {
        console.log(res)
        this.toast.success(res.message);
        this.getCartItems();
      }, error => {
        this.toast.error(error.message);
      })
    }
  }
  modaldismiss() {
    this.machineCubeID = []
    this.machineColumnID =[]
    this.machineDrawID = []
    this.machineCompartmentID =[]
    this.machineStatus=[]
    this.msg="";
    this.msgg="";
    this.ngOnInit()
  }
  close() {
    console.log("hi")
  }
  deleteMultiple() {
    if (this.selected3.length === 0) {
      this.toast.warning('Please select a product')
    } else {
      if (confirm(`Are you sure, you want to Delete?`)) {
        let data = {
          "cart_id": this.cartdata['_id'],
          "item_id": this.selected3,
        }
        this.crudService.update2('cart/deleteItemFromCart', data).pipe(untilDestroyed(this)).subscribe(res => {
          console.log(res)
          this.toast.success(res.message);
          this.getCartItems();
          this.selected3 = [];
        }, error => {
          this.toast.error(error.message);
        })
      }
    }
  }

  ngOnDestroy() { }


  toggle(cart, event: MatCheckboxChange) {
    if (event.checked) {
      this.selected3.push(cart.item._id);
    } else {
      const index = this.selected3.indexOf(cart.item._id);
      if (index >= 0) {
        this.selected3.splice(index, 1);
      }
    }
    console.log(cart.item._id, event.checked);
  }

  exists(cart) {
    return this.selected3.indexOf(cart.item._id) > -1;
  };

  isIndeterminate() {
    return (this.selected3.length > 0 && !this.isChecked());
  };

  isChecked() {
    return this.selected3.length === this.cartList?.length;
  };

Addmore(){
  this.router.navigate(['/pages/home'])

//   let params: any = {};
// params['company_id']=this.permissions?.company_id?._id
//   this.crudService.get1(appModels.CATEGORYLIST,{params}).pipe(untilDestroyed(this)).subscribe((res:any) => {
//     console.log(res)
//    this.category=res['data']
//    localStorage.removeItem("allow") 
//    this.crudService.changemessage(JSON.stringify(this.category[0]))
//   })
}
  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.cartList.forEach(cart => {
        this.selected3.push(cart.item._id)
      });
    } else {
      this.selected3.length = 0;
    }
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

  machineResponse;

  async machineAccess(val) {
    console.log(val);
    var result = groupBy(val, function (item) {
      return [item.cube_id, item.bin_name]
    })

    function groupBy(array, f) {
      let groups = {};
      array.forEach(element => {
        var group = JSON.stringify(f(element));
        groups[group] = groups[group] || [];
        groups[group].push(element)
      });
      return Object.keys(groups).map(function (group) {
        return groups[group]
      })
    }

    var x = 0
    var loop_break = false;
    setInterval(() => {
      for (let val of result) {
        result[x].sort(function (a, b) {
          return b.compartment_name - a.compartment_name;
        });
        this.crudService.post(`${appModels.TAKENOW}/machineAccess`, result[x][0]).pipe(delay(5000)).subscribe(async (res) => {
          console.log(res.details.singledevinfo.column[0].status[0]);
          if (res.details.singledevinfo.column[0].status[0] == "Locked") {
            console.log(Date, 'if 1')
            this.crudService.post(`${appModels.TAKENOW}/unLockMachine`, result[x][0]).pipe(delay(5000)).subscribe(async (res) => {
              if (res.details.unlock.reply[0] == 'NoError') {
                this.toast.success('Machine Unlocked');
              } else if (res.details.Error.request[0] == 'unlock' && res.details.Error.message[0] == 'Busy') {
                this.toast.success('Machine Unlock is in progress and busy');
              }
            })
          } else if (res.details.singledevinfo.column[0].status[0] == "Unlocked") {
            console.log(Date, 'if 2')
            this.toast.success('Machine Unlocked Open and take your products');

          } else if (res.details.singledevinfo.column[0].status[0] == "Closed") {
            this.crudService.post(`${appModels.TAKENOW}/lockMachine`, result[x][0]).pipe(delay(5000)).subscribe(async (res) => {
              if (res.details.unlock.reply[0] == 'NoError') {
                loop_break = true;
                this.toast.success('Machine Locked');
              }
            })
          }
        })
        if (loop_break) {
          x++; // for testing
        }
      }
    }, 10000)
  }

  take() {
    this.machinedetails = [];
    this.val = [];
    for (let cart of this.cartList) {
      let data = { item_name: cart.item.item_name, cube_id: cart.allocation.cube.cube_id, bin_name: cart.allocation.bin.bin_name, compartment_name: cart.allocation.compartment.compartment_name }
      this.val.push(data)
      if (this.cartList.length == this.val.length) {
        this.machineAccess(this.val)
      }
    }
  }

  //************   Arunkumar  ***********************/
  async allDeviceInfo() {
    let response = await this.crudService.get('machine/allDeviceInfo').pipe(untilDestroyed(this)).toPromise()
    console.log(response)
    return response
  }

  async singleDeviceInfo(machine: any) {

    let response = await this.crudService.post('machine/singleDeviceInfo', machine).pipe(untilDestroyed(this)).toPromise()
    console.log(response)
    return response
  }
  // Sleep Function
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Format and Clean Objects
  async formatMachineData() {
    let machineData: any[] = []
    console.log('*******  Format Data **********')
    this.cartList.forEach(async item => {
      let eachItemForMachines = {}
      eachItemForMachines['cart_id'] = item._id
      eachItemForMachines['item_id'] = item.item._id
      eachItemForMachines['qty'] = item.qty
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
  async takeItems(item) {
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions?._id
    this.crudService.get1("log/getUserTakenQuantity",{params}).pipe(untilDestroyed(this)).subscribe(async res => {
      console.log(res)
      if(res?.data.length!=0){
        this.totalquantity=res['data']
        this.totalquantity.trasaction_qty
        console.log(this.totalquantity)
       this.qtys=0
       for(let i=0;i<this.cartList?.length;i++){
        this.qtys +=this.cartList[i]?.qty
         }
      console.log(this.qtys)
          if(this.permissions?.item_max_quantity>=this.totalquantity[0]?.trasaction_qty + this.qtys){
            this.machineCubeID = []
            this.machineColumnID =[]
            this.machineDrawID =[]
            this.machineCompartmentID = []
            this.machineStatus = []
            this.msg=""
            this.msgg=""

            this.modalService.open(item,{backdrop:false});
            let totalMachinesList = await this.formatMachineData()
            let machinesList = await this.groupbyData(totalMachinesList)
            console.log(machinesList)
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
              console.log('maxCompartmentNo')
              console.log(maxCompartmentNo)
              let singleDeviceInfo = await this.singleDeviceInfo(machine)
              let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
              this.machineStatus=status
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
                  await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                  await this.sleep(1000)
                }
        
                // unlock Column API, machine._id, machine.column_id, machine.compartment_id
                await this.crudService.post('machine/unlockBin', machine).pipe(untilDestroyed(this)).toPromise()
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
                  this.machineStatus=status
                  console.log('inside while loop status bin ' + machine.bin_id +" "+ status)
                  if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
                    await this.sleep(9000)
                    await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                    machineColumnStatus = true
                    await this.TakeOrReturnItems.push(machine)
                  }
                  //Drawer current status, (opening, opened, closing, closed)
                  else if (status !== 'Closed' && status !== 'Locked' && status == 'Unknown') {
                    console.log('Current Status = ' + status)
                    this.msg='Current Status = ' + status
                    // ColumnActionStatus = singleDeviceInfo
                  }
                  //set delay time
                  await this.sleep(10000)
                  if (status == 'Unlocked' && apiHitTimes == 14) {
                    await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                  }
                  apiHitTimes++
                }
                // if user does not closed after ceratin count of times API hit
                if (apiHitTimes == 10 && machineColumnStatus !== true) {
                  console.log('Application waiting time over for bin ' + machine.bin_id + 'in column ' + machine.column_id)
        
                }
                let t1 = performance.now();
                eachColumnUsage['column_usage'] = t1 - t0
                totalMachineUsage.push(eachColumnUsage)
                await this.sleep(5000)
              }
              // break for loop if single device info is unknown
              else {
                console.log('Machine status unknown ' + status)
                this.msg='Machine status unknown ' + status
                console.log('Close all drawers properly and click take now')
                this.msg='Close all drawers properly and click take now'
        
                break
              }
            }
            const successTake = await totalMachinesList.filter(array => this.TakeOrReturnItems.some(filter => filter.column_id === array.column_id && filter.bin_id === array.bin_id));
        
            console.log(successTake)
            if (successTake.length == 0) {
              console.log('Machine status unknown No Item taken')
              this.msgg='Machine status unknown No Item taken'
            } else if (successTake.length == totalMachinesList.length) {
              console.log(successTake.length + ' items Taken successfully')
              this.msgg=successTake.length + ' items Taken successfully'
              await this.addMachineUsage(totalMachineUsage)
        
              await this.updateAfterTakeOrReturn(successTake)
            } else if (successTake.length < totalMachinesList.length) {
              console.log(successTake.length + ' items Taken successfully \n' + (totalMachinesList.length - successTake.length) + ' items failed return')
              this.msgg=successTake.length + ' items Taken successfully \n' + successTake.length + ' items failed return'
              await this.addMachineUsage(totalMachineUsage)
        
              await this.updateAfterTakeOrReturn(successTake)
            }
          }else{
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
      }else{
       this.qtys=0
       for(let i=0;i<this.cartList?.length;i++){
        this.qtys +=this.cartList[i]?.qty
         }
         console.log(this.qtys)
          if(this.permissions?.item_max_quantity>= 0 + this.qtys){
            this.machineCubeID = []
            this.machineColumnID =[]
            this.machineDrawID =[]
            this.machineCompartmentID = []
            this.machineStatus = []
            this.msg=""
            this.msgg=""
            this.modalService.open(item,{backdrop:false});
            let totalMachinesList = await this.formatMachineData()
            let machinesList = await this.groupbyData(totalMachinesList)
            console.log(machinesList)
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
              console.log('maxCompartmentNo')
              console.log(maxCompartmentNo)
              let singleDeviceInfo = await this.singleDeviceInfo(machine)
              let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
              this.machineStatus=status
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
                  await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                  await this.sleep(1000)
                }
        
                // unlock Column API, machine._id, machine.column_id, machine.compartment_id
                await this.crudService.post('machine/unlockBin', machine).pipe(untilDestroyed(this)).toPromise()
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
                  console.log('inside while loop status bin ' + machine.bin_id + status)
                  if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
                    await this.sleep(9000)
                    await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                    machineColumnStatus = true
                    await this.TakeOrReturnItems.push(machine)
                  }
                  //Drawer current status, (opening, opened, closing, closed)
                  else if (status !== 'Closed' && status !== 'Locked' && status == 'Unknown') {
                    console.log('Current Status = ' + status)
                    this.msg='Current Status = ' + status
                    // ColumnActionStatus = singleDeviceInfo
                  }
                  //set delay time
                  await this.sleep(10000)
                  if (status == 'Unlocked' && apiHitTimes == 14) {
                    await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                  }
                  apiHitTimes++
                }
                // if user does not closed after ceratin count of times API hit
                if (apiHitTimes == 10 && machineColumnStatus !== true) {
                  console.log('Application waiting time over for bin ' + machine.bin_id + 'in column ' + machine.column_id)
        
                }
                let t1 = performance.now();
                eachColumnUsage['column_usage'] = t1 - t0
                totalMachineUsage.push(eachColumnUsage)
                await this.sleep(5000)
              }
              // break for loop if single device info is unknown
              else {
                console.log('Machine status unknown ' + status)
                this.msg='Machine status unknown ' + status
                console.log('Close all drawers properly and click take now')
                this.msg='Close all drawers properly and click take now'
        
                break
              }
            }
            const successTake = await totalMachinesList.filter(array => this.TakeOrReturnItems.some(filter => filter.column_id === array.column_id && filter.bin_id === array.bin_id));
        
            console.log(successTake)
            if (successTake.length == 0) {
              console.log('Machine status unknown No Item taken')
              this.msgg='Machine status unknown No Item taken'
            } else if (successTake.length == totalMachinesList.length) {
              console.log(successTake.length + ' items Taken successfully')
              this.msgg=successTake.length + ' items Taken successfully'
              await this.addMachineUsage(totalMachineUsage)
        
              await this.updateAfterTakeOrReturn(successTake)
            } else if (successTake.length < totalMachinesList.length) {
              console.log(successTake.length + ' items Taken successfully \n' + (totalMachinesList.length - successTake.length) + ' items failed return')
              this.msgg=successTake.length + ' items Taken successfully \n' + successTake.length + ' items failed return'
              await this.addMachineUsage(totalMachineUsage)
        
              await this.updateAfterTakeOrReturn(successTake)
            }
          }else{
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
      }
    // let data=  {
    //     "success": true,
    //     "data": [
    //         {
    //             "_id": null,
    //             "trasaction_qty": 113
    //         }
    //     ]
    // }
  
      })
   
  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake: any) {
    let data = {
      cart_id: this.cartdata._id,
      take_items: successTake,
      cart_status: 2
    }
    this.crudService.post(`cart/updateReturnTake`, data).pipe().subscribe(async (res) => {
      console.log(res)
      if (res.status) {
        this.toast.success('Cart Updated Successfully');
      }
    })
  }

  async addMachineUsage(data) {
    console.log(data)
    this.crudService.post(`dashboard/machineUsageAdd`, data).pipe().subscribe(async (res) => {
      console.log(res)
      if (res) {
        // this.toast.success('machine Usage Added Successfully...');
      }
    })
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

}







