import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs/operators';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

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

  constructor(private crudService: CrudService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getCartItems();
  }
  getCartItems() {
    this.cartList = [];
    this.crudService.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.cartdata = res[0]
      for (let i = 0; i < this.cartdata?.cart?.length; i++) {
        if (this.cartdata?.cart[i]['cart_status'] == 1 || this.cartdata?.cart[i]['cart_status'] == 2) {
          this.cartList.push(this.cartdata?.cart[i])
        }
      }

      this.crudService.getcarttotal(this.cartList?.length)
    }, error => {
      this.toast.error(error.message);
    })
  }

  updateCart(cart, qty) {
    console.log(qty)
    let data = {
      "item": cart.item._id,
      "allocation": cart.allocation,
      "qty": qty,
      "cart_id": this.cartdata['_id']
    }
    this.crudService.update2(appModels.updateCart, data).pipe(untilDestroyed(this)).subscribe(res => {
      console.log(res)
      this.toast.success(res.message);
      this.getCartItems();
    }, error => {
      this.toast.error(error.message);
    })
  }

  deleteCart(cart) {
    if (confirm(`Are you sure, you want to Delete?`)) {
      let data = {
        "cart_id": this.cartdata['_id'],
        "item_id": [cart.item._id],
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

  async singleDeviceInfo(machine) {

    let response = await this.crudService.post('machine/singleDeviceInfo', machine).pipe(untilDestroyed(this)).toPromise()
    console.log(response)
    return response
  }
  // Sleep Function
  sleep(ms) {
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
    console.log(machineData)
    let formatedData = await this.groupbyData(machineData)
    return formatedData

  }

  // GroupBy machineData by bin_id and column id
  async groupbyData(arr) {
    let helper = {};
    var result = arr.reduce(function (r, o) {
      var key = o.column_id + '-' + o.bin_id;
      if (!helper[key]) {
        helper[key] = Object.assign({}, o); // create a copy of o
        r.push(helper[key]);
      } else {
        helper[key].column_id = [o.column_id, helper[key].column_id]
        helper[key].bin_id = [o.bin_id, helper[key].bin_id];
      }
      return r;
    }, []);

    let i = 0
    for (let item of result) {
      if (typeof item.column_id == 'object') {
        result[i]['column_id'] = [].concat.apply([], item.column_id);
      }
      if (typeof item.bin_id == 'object') {
        result[i]['bin_id'] = [].concat.apply([], item.bin_id);
      }
      i++
    }
  }

  // filter successfully taken items from cartList take now
  fiterArray(cartList, successTake) {
    const successTakeItems = cartList.filter(array => successTake.some(filter => filter.bin_id === array.bin_id && filter.column_id === array.column_id));
    return successTakeItems
  }
  // Take Items form machine  
  TakeOrReturnItems: any[] = []
  async takeItems() {
    //call allDevInfo once
    await this.allDeviceInfo()
    // for loop for all machines lids
    for await (let machine of this.machinesList) {
      if (typeof machine.compartment_id == 'object') {
        let maxCompartmentNo = Math.max(...machine.compartment_id)
        machine['compartment_id'] = maxCompartmentNo
      }
      let singleDeviceInfo = await this.singleDeviceInfo(machine)
      let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
      console.log('**** drawer iteration *****' + machine.bin_id)
      console.log(status)

      if (status == 'Locked' || status == 'Closed' || status == 'Unlocked') {
        // Lock that Column API, machine._id
        await this.crudService.post('machine/lockBin', machine).pipe(untilDestroyed(this)).toPromise()

        // unlock Column API, machine._id, machine.column_id, machine.compartment_id
        await this.crudService.post('machine/unlockBin', machine).pipe(untilDestroyed(this)).toPromise()
        await this.sleep(10000)
        let apiHitTimes = 0
        let machineColumnStatus = false
        while (apiHitTimes < 10 && !machineColumnStatus) {
          console.log('********************* while loop **************' + machineColumnStatus)
          let singleDeviceInfo = await this.singleDeviceInfo(machine)
          let status = singleDeviceInfo.details.singledevinfo.column[0]['status'][0]
          console.log('inside while loop status bin ' + machine.bin_id + status)
          if (status == 'Closesd' || status == 'Locked') {
            machineColumnStatus = true
            this.TakeOrReturnItems.push(machine)
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
        if (apiHitTimes == 10 && this.machineColumnStatus !== true) {
          console.log('Application waiting time over for bin ' + machine.bin_id + 'in column ' + machine.column_id)

        }
        await this.sleep(10000)
      }
      // break for loop if single device info is unknown
      else {
        console.log('Machine status unknown ' + status)
        console.log('Close all drawers properly and click take now')
        break
      }
    }
    let successTake = await this.fiterArray(this.machinesList, this.TakeOrReturnItems)
    if (successTake.length = 0) {
      console.log('Machine status unknown No Item taken')
    } else if (successTake.length == this.machinesList.length) {
      console.log(successTake.length + ' items Taken successfully')
      await this.updateAfterTakeOrReturn(successTake)
    } else if (successTake.length < this.machinesList.length) {
      console.log(successTake.length + ' items Taken successfully \n' + successTake.length + ' items failed return')
      await this.updateAfterTakeOrReturn(successTake)
    }
  }

  //Update Cart and Stock Allocation documents after item Take/Return
  async updateAfterTakeOrReturn(successTake) {
    let data = {
      cart_id: this.cartdata._id,
      take_items: successTake,
      cart_status: 2
    }
    this.crudService.post(`cart/updateAfterTakeReturn`, data).pipe().subscribe(async (res) => {
      if (res.status == 'success') {
        this.toast.success('Cart Updated Successfully');
      }
    })

  }

  
  machinesList = [
    {
      column_id: 1,
      bin_id: 1,
      compartment_id: 5
    },
    {
      column_id: 1,
      bin_id: 2,
      compartment_id: 5
    },
    {
      column_id: 1,
      bin_id: 3,
      compartment_id: 5
    },
    {
      column_id: 1,
      bin_id: 4,
      compartment_id: 5
    },
    {
      column_id: 1,
      bin_id: 5,
      compartment_id: 5
    },
  ]
  machineColumnStatus

}







