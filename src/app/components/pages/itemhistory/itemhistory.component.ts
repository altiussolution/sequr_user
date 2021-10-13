import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  itemhistorycart: any=[];
  itemhistorykit: any=[];
  date: any;
  date1: any;
  arrayvalue:any=[]
  DataForm:FormGroup;
  @ViewChild('closebutton') closebutton;
  arrayvalue1: any=[];
  id: any;
  cartdata: any=[];
  constructor(public crud:CrudService, private toast: ToastrService) { }
  ngOnInit(): void {
  this.arrayvalue1=[];
  this.arrayvalue=[];
  this.crud.get(appModels.ITEMLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.itemhistorycart=[]
      this.cartdata=res['Cart'][0]['cart']
      for(let i=0;i< this.cartdata?.length;i++){
        if(this.cartdata[i]['cart_status']==2){
        this.itemhistorycart.push(this.cartdata[i])
        }}
      this.id=res['Cart'][0]['_id']
      this.date=res['Cart'][0]['updated_at']
      this.itemhistorykit=res['Kits']
  })
}
  passParams(event:any,val:any){
    if(event.target.checked){
      this.arrayvalue.push(val);
      }
    if (!event.target.checked) {
      let index = this.arrayvalue.indexOf(val);
    if (index > -1) {
      this.arrayvalue.splice(index, 1);
      }
    }
    console.log(this.arrayvalue)
  }
  delete(i:any){
    if (i > -1) {
      this.arrayvalue.splice(i, 1);
      }
  }
  myFunction(event,i){
    console.log(event.target.id)
    if(this.arrayvalue[i].qty>=event.target.value){

    }else{
    (<HTMLInputElement>document.getElementById(event.target.id)).value="";
    }
  }

  close(){
    this.ngOnInit();
  }
  returnproduct(){
    if(this.arrayvalue.length!=0){
    var result = this.arrayvalue.map(function(a) {return a?._id;});
    console.log(this.itemhistorycart["_id"])
    let data={
      "cart_id": this.id,
      "return_items" : result,
      "cart_status" : 3 ,
     
    }
  this.crud.update2(appModels.RETURNCART,data).pipe(untilDestroyed(this)).subscribe((res:any) => {
     this.closebutton.nativeElement.click();
     this.toast.success("Item Returned Successfully")
     this.ngOnInit();
    })
  }else{
    this.toast.error("Please choose any item from list")
    this.closebutton.nativeElement.click();
    this.ngOnInit();
  }
  }
  passParams1(event:any,val:any){
    if(event.target.checked){
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
  returnkits(){
    if(this.arrayvalue1.length!=0){
      var kitnames = this.arrayvalue1.map(function(a) {return a?.kit_name;});
      if (confirm(`Are you sure want to Return the Kits for ${kitnames}?`)) {
          var kitids = this.arrayvalue1.map(function(a) {return a?.update_kit_id;});
          var cartid = this.arrayvalue1.map(function(a) {return a?.cart_id;});
          console.log(kitids)
          let data={
            "cart_id":cartid,
          "return_items" : kitids,
          "kit_status" : 3,
          }
    this.crud.update2(appModels.RETURNCART,data).pipe(untilDestroyed(this)).subscribe((res:any) => {
       this.closebutton.nativeElement.click();
       this.toast.success("Kit Returned Successfully")
       this.ngOnInit();
      })
    }else{
      this.ngOnInit();
    }
    }else{
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
  async formatMachineData() {
    let machineData: any[] = []
    console.log('*******  Format Data **********')
    this.arrayvalue.forEach(async item => {
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
  async returnItem() {
    let totalMachinesList = await this.formatMachineData()
    let machinesList = await this.groupbyData(totalMachinesList)
    console.log(machinesList)
    //call allDevInfo once
    // await this.allDeviceInfo()
    // for loop for all machines lids
    for await (let machine of machinesList) {
      let maxCompartmentNo = Math.max(...machine.compartment_id)
      machine['compartment_id'] = maxCompartmentNo
      console.log('maxCompartmentNo')
      console.log(maxCompartmentNo)
      let singleDeviceInfo = await this.singleDeviceInfo(machine)
      let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
      console.log('Column : ' + machine.column_id + '' + 'drawer: ' + machine.bin_id + ' ' + 'Compartment: ' + machine.compartment_id)
      console.log(status)

      if (status == 'Locked' || status == 'Closed' || status == 'Unlocked') {
        // Lock that Column API, machine._id
        if (status == 'Closed' || status == 'Unlocked') {
          await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
          await this.sleep(1000)
        }

        // unlock Column API, machine._id, machine.column_id, machine.compartment_id
        await this.crud.post('machine/unlockBin', machine).pipe(untilDestroyed(this)).toPromise()
        await this.sleep(10000)
        let apiHitTimes = 0
        let machineColumnStatus = false
        while (apiHitTimes < 15 && !machineColumnStatus) {
          console.log('********************* while loop **************' + machineColumnStatus)
          let singleDeviceInfo = await this.singleDeviceInfo(machine)
          let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
          console.log('inside while loop status bin ' + machine.bin_id + status)
          if (status == 'Closed' || status == 'Locked') {
            await this.sleep(9000)
            await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()            
            machineColumnStatus = true
            await this.TakeOrReturnItems.push(machine)
          }
          //Drawer current status, (opening, opened, closing, closed)
          else if (status !== 'Closed' && status !== 'Locked') {
            console.log('please close properly, Current Status = ' + status)
            // ColumnActionStatus = singleDeviceInfo
          }
          //set delay time
          await this.sleep(10000)
          apiHitTimes++
        }
        // if user does not closed after ceratin count of times API hit
        if (apiHitTimes == 10 && machineColumnStatus !== true) {
          console.log('Application waiting time over for bin ' + machine.bin_id + 'in column ' + machine.column_id)

        }
        await this.sleep(5000)
      }
      // break for loop if single device info is unknown
      else {
        console.log('Machine status unknown ' + status)
        console.log('Close all drawers properly and click take now')
        break
      }
    }
    const successTake = await totalMachinesList.filter(array => this.TakeOrReturnItems.some(filter => filter.column_id === array.column_id && filter.bin_id === array.bin_id));

    console.log(successTake)
    if (successTake.length == 0) {
      console.log('Machine status unknown No Item taken')
    } else if (successTake.length == totalMachinesList.length) {
      console.log(successTake.length + ' items Taken successfully')
      await this.updateAfterTakeOrReturn(successTake)
    } else if (successTake.length < totalMachinesList.length) {
      console.log(successTake.length + ' items Taken successfully \n' + successTake.length + ' items failed return')
      await this.updateAfterTakeOrReturn(successTake)
    }
  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake: any) {
    let data = {
      cart_id: this.id,
      take_items: successTake,
      cart_status: 3
    }
    this.crud.post(`cart/updateReturnTake`, data).pipe().subscribe(async (res) => {
      console.log(res)
      if (res.status) {
        this.toast.success('Cart Updated Successfully');
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


  ngOnDestroy(){}
}
