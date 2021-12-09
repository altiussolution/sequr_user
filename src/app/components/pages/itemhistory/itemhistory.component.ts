import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-itemhistory',
  templateUrl: './itemhistory.component.html',
  styleUrls: ['./itemhistory.component.scss']
})
export class ItemhistoryComponent implements OnInit {
  itemhistorycart: any = [];
  itemhistorykit: any = [];
  date: any;
  date1: any;
  arrayvalue: any = []
  DataForm: FormGroup;
  @ViewChild('closebutton') closebutton;
  arrayvalue1: any = [];
  id: any;
  cartdata: any = [];
  permissions:any=[];
view:any;
  add: any;
  update: any;
  deleted: any;
  machineCubeID: any;
  machineColumnID: any;
  machineDrawID: any;
  machineCompartmentID: any;
  machineStatus: any;
  msg: string;
  msgg: string;
  arrayvalue2: any=[];
  arrayvaluess: any;
  invalid: any=[];
  kitdata: any=[];
  array: any=[];
  constructor(public crud: CrudService, private toast: ToastrService, public modalService: NgbModal) { }
  ngOnInit(): void {

    this.permissions=JSON.parse(localStorage.getItem("personal"))
    this.view=this.permissions.role_id.permission.find(temp=>temp=="return_permission")
console.log(this.permissions.role_id.permission)
console.log(this.permissions?.company_id?._id)


    this.arrayvalue1 = [];
    this.arrayvalue = [];
    let params: any = {};
    params['company_id']=this.permissions?.company_id?._id
    params['user_id']=this.permissions?._id
    this.crud.get1(appModels.ITEMLIST,{params}).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.itemhistorycart = []
      if(res['status']==true){
        this.cartdata = res['Cart'][0]['cart']
        this.kitdata=res['Kits']
      }
     
      for (let i = 0; i < this.cartdata?.length; i++) {
        if (this.cartdata[i]['cart_status'] == 2) {
          this.itemhistorycart.push(this.cartdata[i])
        }
      }
      if(res['status']==true){
      this.id = res['Cart'][0]['_id']
      this.date = res['Cart'][0]['updated_at']
      }
      // this.itemhistorykit = res['Kits']

      console.log(this.itemhistorykit)
      this.itemhistorykit=[]
      for (let i = 0; i < this.kitdata?.length; i++) {
        if (this.kitdata[i]['kit_status'] == 2) {
          this.itemhistorykit.push(this.kitdata[i])
        }
      }
      if(this.itemhistorykit==undefined){
        this.itemhistorykit=[]

      }
    })
  }
  passParams(event: any, val: any) {
    if (event.target.checked) {
      this.arrayvalue.push(val);
   
    }
    if (!event.target.checked) {
      let index = this.arrayvalue.indexOf(val);
     
      console.log(this.arrayvalue)
      if (index > -1) {
        this.arrayvalue.splice(index, 1);
      }
    
    }
    console.log(this.arrayvalue)
  }
  passParams12(event: any, val: any) {
    if (event.target.checked) {
    
      this.array.push(val)
    }
    if (!event.target.checked) {
     
      let index = this.array.indexOf(val);
      console.log(this.arrayvalue)
     
      if (index > -1) {
        this.array.splice(index, 1);
      }
    }
    console.log(this.array)
  }
  delete(i: any) {
    if (confirm(`Are you sure want to delete?`)) {
    if (i > -1) {
      this.arrayvalue.splice(i, 1);
      this.array.splice(i, 1);
      this.toast.success("Item deleted from choosed list")
    }
    }else {
     
    }
  }
  // changing(event) {

  //   console.log(event.target.value)
  //   if (this.arrayvalue2[i].qty >= event.target.value) {
  //     this.qut = event.target.value
  //   } else {
  //     (<HTMLInputElement>document.getElementById(event.target.id)).value = "";
  //     this.qut = 0
  //     this.toast.error("You have reached maximum quantity of the item.")
  //   }
  // }

  myFunction(event, i) {
    // console.log(typeof parseInt(event.target.value) + '' + parseInt(event.target.value))
    console.log((this.array[i].qty))
    console.log(event.target.value)
    this.Methodl(this.array[i].qty,event.target.value,i,event.target.id)
  //   if(parseInt(event.target.value) !=0){
  //     console.log('****** Inside if ********')
  //    const nvals=this.arrayvalue2[i]?.qty
  //     if (parseInt(nvals) > parseInt(event.target.value)) {
  //       console.log('****** Inside if 2 ********')

  //       this.arrayvalue[i].qty=parseInt(event.target.value)
  //      } else {
  //        (<HTMLInputElement>document.getElementById(event.target.id)).value = "";
  //        this.toast.error("You have reached Item max quantity")
  //      }
  //   }else{
  //     this.toast.error("Please enter valid quantity");
  //     this.arrayvalue[i].qty=0;
  //     (<HTMLInputElement>document.getElementById(event.target.id)).value = "";
  //   }

  }
  Methodl(qtys,val,i,id) {
    if (Number(qtys) >= Number(val)) {
      // qtys = Number(val)

      // this.arrayvalue[i].qty=Number(qtys)
    } else {
      (<HTMLInputElement>document.getElementById(id)).value = "";
      qtys= 0
      this.toast.error("You have reached maximum quantity of the item.")
    }
  }
  


  close() {
    this.arrayvalue=[]
    this.array=[]
    this.ngOnInit();
  }
  modaldismiss() {
    this.arrayvalue=[]
    this.array=[]
    this.closebutton.nativeElement.click();
    this.machineCubeID = []
    this.machineColumnID =[]
    this.machineDrawID = []
    this.machineCompartmentID =[]
    this.machineStatus=[]
    this.msg="";
    this.msgg="";
    this.ngOnInit()
  }
  returnproduct() {
    if (this.arrayvalue.length != 0) {
      var result = this.arrayvalue.map(function (a) { return a?._id; });
      console.log(this.itemhistorycart["_id"])
      let data = {
        "cart_id": this.id,
        "return_items": result,
        "cart_status": 3,
"company_id":this.permissions?.company_id?._id
      }
      this.crud.update2(appModels.RETURNCART, data).pipe(untilDestroyed(this)).subscribe((res: any) => {
        this.closebutton.nativeElement.click();
        this.toast.success("Item Returned Successfully")
        this.ngOnInit();
      })
    } else {
      this.toast.error("Please choose any item from list")
      this.closebutton.nativeElement.click();
      this.ngOnInit();
    }
  }
  passParams1(event: any, val: any) {
    if (event.target.checked) {
      this.arrayvalue1.push(val);
    }
    if (!event.target.checked) {
      let index = this.arrayvalue1.indexOf(val);
      if (index > -1) {
        this.arrayvalue1.splice(index, 1);
      }
    }
    console.log(this.arrayvalue1)
  }
  returnkits() {
    if (this.arrayvalue1.length != 0) {
      var kitnames = this.arrayvalue1.map(function (a) { return a?.kit_name; });
      if (confirm(`Are you sure want to Return the Kits for ${kitnames}?`)) {
        var kitids = this.arrayvalue1.map(function (a) { return a?.update_kit_id; });
        var cartid = this.arrayvalue1.map(function (a) { return a?.cart_id; });
        console.log(kitids)
        let data = {
          "cart_id": cartid,
          "return_items": kitids,
          "kit_status": 3,
          "company_id":this.permissions?.company_id?._id
        }
        this.crud.update2(appModels.RETURNCART, data).pipe(untilDestroyed(this)).subscribe((res: any) => {
          this.closebutton.nativeElement.click();
          this.toast.success("Kit Returned Successfully")
          this.ngOnInit();
        })
      } else {
        this.ngOnInit();
      }
    } else {
      this.toast.error("Please choose any kit from list")
    }

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
    if (item == 'cart') {
      this.arrayvalue.forEach(async item => {
        let eachItemForMachines = {}
        eachItemForMachines['cart_id'] = item._id || item.cart_id
        eachItemForMachines['item_id'] = item.item._id
        eachItemForMachines['qty'] = item.qty
        eachItemForMachines['stock_allocation_id'] = item.item_details._id
        eachItemForMachines['cube_id'] = item.item_details.cube.cube_id
        eachItemForMachines['column_id'] = item.item_details.bin.bin_id
        eachItemForMachines['bin_id'] = item.item_details.compartment.compartment_id
        eachItemForMachines['compartment_id'] = item.item_details.compartment_number
        await machineData.push(eachItemForMachines)
      });
    }
    else if (item == 'kit') {
      let i = 0
      this.arrayvalue1[0].kit_item_details.forEach(async item => {
        let eachItemForMachines = {}
        eachItemForMachines['cart_id'] = this.arrayvalue1[0].cart_id
        eachItemForMachines['kit_id'] = this.arrayvalue1[0].kit_id._id
        eachItemForMachines['kit_cart_id'] = this.arrayvalue1[0].kit_cart_id
        eachItemForMachines['item_id'] = item.item._id
        eachItemForMachines['kit_qty'] = this.arrayvalue1[0].qty
        eachItemForMachines['qty'] = this.arrayvalue1[0].kit_id.kit_data[i].qty
        eachItemForMachines['qty'] = 1
        eachItemForMachines['stock_allocation_id'] = item._id
        eachItemForMachines['cube_id'] = item.cube.cube_id
        eachItemForMachines['column_id'] = item.bin.bin_id
        eachItemForMachines['bin_id'] = item.compartment.compartment_id
        eachItemForMachines['compartment_id'] = item.compartment_number
        await machineData.push(eachItemForMachines)
        i++

      })

    }

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

   returnItem1(item: string,modal,kitting) {

    if(item=="cart"){
this.invalid=[]
      for(let k=0;k<this.arrayvalue?.length;k++){
       if((<HTMLInputElement>document.getElementById('quantity'+k)).value==''){
      this.invalid.push(this.arrayvalue[k])
      }
      }
      console.log(this.arrayvalue)
      console.log(this.invalid)
      if(this.invalid?.length==0){
       for(let j=0;j<this.arrayvalue?.length;j++){
        this.arrayvalue[j].qty=(<HTMLInputElement>document.getElementById('quantity'+j)).value
       }
        // this.modalService.open(modal,{backdrop:false});
      this.returnItem("cart",modal)
      }else{
        this.toast.error("Please enter valid quantity")
      }
    }else{
      this.arrayvalue1=[]
      this.arrayvalue1.push(kitting)
      // this.modalService.open(modal,{backdrop:false});
      this.returnItem("kit",modal)
    }
   
}

 async returnItem(item: string,modal) {
  if (confirm(`Are you sure want to return?`)) {
  
        this.machineCubeID = []
        this.machineColumnID =[]
        this.machineDrawID =[]
        this.machineCompartmentID = []
        this.machineStatus = []
        this.msg=""
        this.msgg=""
        this.modalService.open(modal,{backdrop:false});
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
              console.log('inside while loop status bin ' + machine.bin_id + status)
            
              if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
                await this.sleep(9000)
                await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
                machineColumnStatus = true
                await this.TakeOrReturnItems.push(machine)
              }
              //Drawer current status, (opening, opened, closing, closed)
              else if (status !== 'Closed' && status !== 'Locked' && status !== 'Unknown') {
                console.log('Current Status = ' + status)
                this.machineStatus = status
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
          console.log('Machine status unknown No Item returned')
          this.msgg='Machine Status Unknown No Item Returned'
        } else if (successTake.length == totalMachinesList.length) {
          console.log(successTake.length + ' items returned successfully')
          this.msgg=successTake.length + ' items returned successfully'
          await this.addMachineUsage(totalMachineUsage)
          await this.updateAfterTakeOrReturn(successTake, item)
        } else if (successTake.length < totalMachinesList.length) {
          console.log(successTake.length + ' items Taken successfully \n' + successTake.length + ' items failed return')
          this.msgg=successTake.length + ' items Taken successfully'
          await this.addMachineUsage(totalMachineUsage)
          await this.updateAfterTakeOrReturn(successTake, item)
        }
  
    }

  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake: any, item?) {
    let data = {
      cart_id: this.id,
      take_items: successTake,
    }
    if (item == 'cart') {
      data['cart_status'] = 3
    } else {
      data['kit_status'] = 3

    }
    this.crud.post(`cart/updateReturnTake`, data).pipe().subscribe(async (res) => {
      console.log(res)
      if (res.status) {
        this.toast.success('Cart Updated Successfully');
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
