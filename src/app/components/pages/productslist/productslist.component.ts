import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  kitdatas: any=[];
  kits: any;
  List: any;
  highkitqty: any=[];
  permissions:any=[];
  totalquantity: any=[];
  kitdatas1: any;
  qtyss: number;
  dooropen: boolean=false;
  constructor(public crud: CrudService, private toast: ToastrService,public modalService: NgbModal) { }

  ngOnInit(): void {
    this.permissions=JSON.parse(localStorage.getItem("personal"))
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    this.crud.get1(appModels.KITTINGLIST,{params}).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.kit = res.data
      this.getData({ pageIndex: this.page, pageSize: this.size });
    })
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
  addkitcart(_id: any, data,modal) {
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions?._id
    this.crud.get1("log/getUserTakenQuantity",{params}).pipe(untilDestroyed(this)).subscribe(async res => {
      console.log(res)
      if(res?.data?.length!=0){
        this.totalquantity=res['data']
        this.totalquantity.trasaction_qty
        this.kitdatas1=data
        this.qtyss=0
        for(let j=0;j<this.kitdatas1?.kit_data?.length;j++){
          this.qtyss +=this.kitdatas1?.kit_data[j]?.kit_item_qty;
          console.log(this.qtyss)
        }
      if(this.permissions?.item_max_quantity>=this.totalquantity[0]?.trasaction_qty + this.qtyss){
            this.highkitqty=[];
            console.log(data)
             this.kitdatas=data
             console.log(this.kitdatas.kit_data)
             this.kits = this.kitdatas.kit_data.map(m => { 
            if(m.kit_item_qty > m.quantity) { 
             this.highkitqty.push(m?.kit_item_qty+'>'+m?.qty)
               return false;
           }
          return true;
             })
         console.log(this.kits)
         this.List = this.kits.filter(item => item === false);
         console.log(this.List)
         if(this.List?.length ==0){
           this.modalService.open(modal,{backdrop:false});
            this.crud.post(appModels.ADDKITCART + _id).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
               console.log(res)
               if (res != "") {
                 if (res['message'] == "Successfully added into cart!") {
                  //  this.toast.success("Kitting cart added successfully")
                   await this.itemHistory(data)
         
                 }
               }
             }, error => {
              //  this.toast.error("Kitting cart added Unsuccessfully")
             })
         }else{
           // this.toast.error("now choosed the kit item quantity for"+this.highkitqty)
           this.toast.error("Requested Quantity Was Not Available")
         }
       
          }
          else{
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
      }else{
      
        this.kitdatas1=data
        this.qtyss=0
        for(let j=0;j<this.kitdatas1?.kit_data?.length;j++){
          this.qtyss +=this.kitdatas1?.kit_data[j]?.kit_item_qty;
          console.log(this.qtyss)
        }
      if(this.permissions?.item_max_quantity>= 0 + this.qtyss){
            this.highkitqty=[];
            console.log(data)
             this.kitdatas=data
             console.log(this.kitdatas.kit_data)
             this.kits = this.kitdatas.kit_data.map(m => { 
            if(m.kit_item_qty > m.quantity) { 
             this.highkitqty.push(m?.kit_item_qty+'>'+m?.qty)
               return false;
           }
          return true;
             })
         console.log(this.kits)
         this.List = this.kits.filter(item => item === false);
         console.log(this.List)
         if(this.List?.length ==0){
           this.modalService.open(modal,{backdrop:false});
            this.crud.post(appModels.ADDKITCART + _id).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
               console.log(res)
               if (res != "") {
                 if (res['message'] == "Successfully added into cart!") {
                  //  this.toast.success("Kitting cart added successfully")
                   await this.itemHistory(data)
         
                 }
               }
             }, error => {
              //  this.toast.error("Kitting cart added Unsuccessfully")
             })
         }else{
           // this.toast.error("now choosed the kit item quantity for"+this.highkitqty)
           this.toast.error("Requested Quantity Was Not Available")
         }
       
          }else{
            this.toast.error("You have exceeded item maximum quantity taken per day.")
          }
      }
      
    })
 
  }
  
  async itemHistory(data) {
    this.machineCubeID = []
    this.machineColumnID =[]
    this.machineDrawID = []
    this.machineCompartmentID =[]
    this.machineStatus=[]
    this.msg="";
    this.msgg="";
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions?._id
    this.crud.get1(appModels.ITEMLIST,{params}).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
      console.log(res)
      this.id = res?.Cart[0]['_id']
      this.itemhistorykit = res['Kits']
      for await (let kit of this.itemhistorykit) {
        if (kit.kit_status == 1 && kit.kit_id._id == data._id) {
          this.takeNowKit.push(kit)
        }
      }
      await this.takeKit('kit')
    })
  }
  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.data = this.kit.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
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
    console.log(this.takeNowKit) 

    let i = 0
    this.takeNowKit[0].kit_item_details.forEach(async item => {
      let eachItemForMachines = {}
      eachItemForMachines['cart_id'] = this.takeNowKit[0].cart_id
      eachItemForMachines['kit_id'] = this.takeNowKit[0].kit_id._id
      eachItemForMachines['kit_cart_id'] = this.takeNowKit[0].kit_cart_id
      eachItemForMachines['item_id'] = item.item._id
      eachItemForMachines['kit_qty'] = this.takeNowKit[0].qty
      eachItemForMachines['qty'] = this.takeNowKit[0].kit_id.kit_data[i].qty
      eachItemForMachines['qty'] = 1
      eachItemForMachines['stock_allocation_id'] = item._id
      eachItemForMachines['cube_id'] = item.cube.cube_id
      eachItemForMachines['column_id'] = item.bin.bin_id
      eachItemForMachines['bin_id'] = item.compartment.compartment_id
      eachItemForMachines['compartment_id'] = item.compartment_number
      await machineData.push(eachItemForMachines)
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
  async takeKit(item: string) {

    console.log(item)
    let totalMachinesList = await this.formatMachineData(item)
    console.log(totalMachinesList)
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
      console.log('Column : ' + machine.column_id + '' + 'drawer: ' + machine.bin_id + ' ' + 'Compartment: ' + machine.compartment_id)
      console.log(status)
      this.machineCubeID = machine.cube_id
      this.machineColumnID = machine.column_id
      this.machineDrawID = machine.bin_id
      this.machineCompartmentID = machine.compartment_id
      this.machineStatus=status
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
          console.log('********************* API Hit Times ************** ' + machineColumnStatus)
          console.log(' Machine Status : ' + machineColumnStatus)
          let singleDeviceInfo = await this.singleDeviceInfo(machine)
          let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
          this.machineStatus=status
          console.log('inside while loop status bin ' + machine.bin_id +" "+ status)
          if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
            await this.sleep(9000)
            await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
            machineColumnStatus = true
            await this.TakeOrReturnItems.push(machine)
          }
          //Drawer current status, (opening, opened, closing, closed)
          else if (status !== 'Closed' && status !== 'Locked' && status == 'Unknown') {
            console.log('Current Status = ' + status)
            this.machineStatus=status
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
      console.log(successTake.length + ' items Taken successfully \n' + successTake.length + ' items failed return')
      await this.addMachineUsage(totalMachineUsage)
      await this.updateAfterTakeOrReturn(successTake, item)
      this.msgg=successTake.length + ' items Taken successfully \n'

    }
  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake: any, item?) {
    let data = {
      cart_id: this.id,
      take_items: successTake,
    }
    if (item == 'cart') {
      data['cart_status'] = 2
    } else {
      data['kit_status'] = 2

    }
    this.crud.post(`cart/updateReturnTake`, data).pipe().subscribe(async (res) => {
      console.log(res)
      this.dooropen=true
      if (res.status) {
       
        this.toast.success('Items Taken Successfully');
      
      }
    })
  }
  async addMachineUsage(data) {
    console.log(data)
    this.crud.post(`dashboard/machineUsageAdd`, data).pipe().subscribe(async (res) => {
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


  ngOnDestroy() { }
}
