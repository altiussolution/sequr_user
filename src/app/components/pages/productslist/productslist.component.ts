import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
import { ToastrService } from 'ngx-toastr';

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
  constructor(public crud: CrudService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.crud.get(appModels.KITTINGLIST).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.kit = res.data
      this.getData({ pageIndex: this.page, pageSize: this.size });
    })
  }
  addkitcart(_id: any, data) {
    this.crud.post(appModels.ADDKITCART + _id).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
      console.log(res)
      if (res != "") {
        if (res['message'] == "Successfully added into cart!") {
          this.toast.success("Kitting cart added successfully")
          await this.itemHistory(data)

        }
      }
    }, error => {
      this.toast.error("Kitting cart added Unsuccessfully")
    })
  }
  async itemHistory(data) {
    this.crud.get(appModels.ITEMLIST).pipe(untilDestroyed(this)).subscribe(async (res: any) => {
      console.log(res)
      this.id = res['Cart'][0]['_id']
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
      eachItemForMachines['cube_id'] = item.cube._id
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
    let totalMachinesList = await this.formatMachineData(item)
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

      if (status == 'Locked' || status == 'Closed' || status == 'Unlocked' || status == 'Unknown') {
        // Lock that Column API, machine._id
        if (status == 'Closed' || status == 'Unlocked' || status == 'Unknown') {
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
          console.log('********************* while loop **************' + machineColumnStatus)
          let singleDeviceInfo = await this.singleDeviceInfo(machine)
          let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
          console.log('inside while loop status bin ' + machine.bin_id + status)
          if (status == 'Closed' || status == 'Locked' || status == 'Unknown') {
            await this.sleep(9000)
            await this.crud.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()
            machineColumnStatus = true
            await this.TakeOrReturnItems.push(machine)
          }
          //Drawer current status, (opening, opened, closing, closed)
          else if (status !== 'Closed' && status !== 'Locked' && status == 'Unknown') {
            console.log('please close properly, Current Status = ' + status)
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
        totalMachineUsage.push(eachColumnUsage)
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
      await this.updateAfterTakeOrReturn(successTake, item)
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
