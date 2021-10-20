import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
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
  message: any=[];


  @ViewChild('videoPlayer') videoplayer: any;
  public startedPlay: boolean = false;
  public show: boolean = false;
  videoSource = "";
  videoform: FormGroup;
  constructor(public router: Router, private toast: ToastrService, private fb: FormBuilder, public crud: CrudService) {


  }

  toggleVideo(event: any) {
    console.log(event)
    this.videoplayer.nativeElement.play();
  }
  ngOnInit(): void {
    this.crud.CurrentMessage3.subscribe((message: any) => {
      console.log(message)
      //console.log(localStorage.getItem("_id"))
      if (message != "" && !localStorage.getItem("hlo")) {
        this.message = message
        console.log(this.message)
        this.crud.get(appModels.DETAILS + this.message).pipe(untilDestroyed(this)).subscribe((res: any) => {
          console.log(res)
          localStorage.setItem("hlo","data")
          this.items = res.items
this.videoSource=this.items.video_path
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
  }
  changing(event) {

    console.log(event.target.value)
    if (this.qty >= event.target.value) {
      this.qut = event.target.value
    } else {
      (<HTMLInputElement>document.getElementById(event.target.id)).value = "";
      this.qut = 0
    }
  }
//  sendimg(a)
// {
//   debugger
//   // element: HTMLImageElement;
//   // var myImg = <HTMLInputElement>document.getElementById('mainimg');
//   var myImg = document.getElementById("mainimg") as HTMLImageElement;
// // document.getElementById('mainimg').src=a.src;
// myImg.src = a.src;

// }
  async addtocart(item?) {
    if (this.qut && this.qut > 0) {
      let cart = {
        "item": this.machine.item,
        "total_quantity": this.qut,

      }

      this.crud.post(appModels.ADDTOCART, cart).subscribe(async res => {
        console.log(res)
        this.toast.success("cart added successfully")
        this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(async res => {
          console.log(res)
          if (res) {
            this.crud.getcarttotal(res[0]?.length)
            this.router.navigate(['pages/mycart'])
            if (item) {
              this.cartList = [];
              this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(async res => {
                console.log(res)
                this.cartdata = res[0]
                for (let i = 0; i < this.cartdata?.cart?.length; i++) {
                  if (this.cartdata?.cart[i]['cart_status'] == 1 && this.cartdata?.cart[i]['item']['_id'] == this.machine.item) {
                    this.cartList.push(this.cartdata?.cart[i])
                  }
                }
                await this.takeItem(item)
                console.log(this.cartList)
                this.crud.getcarttotal(this.cartList?.length)
              }, error => {
                this.toast.error(error.message);
              })
            }
            //Arunkumar

          }

        }, error => {
          this.toast.error(error.message);
        })
      })
    } else {
      this.toast.error("please Enter QTY")
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
    // await this.addtocart()
    // await this.getCartItems()
    let totalMachinesList = await this.formatMachineData(item)
    console.log(totalMachinesList)
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




  pauseVideo(videoplayer) {
    videoplayer.nativeElement.play();
    // this.startedPlay = true;
    // if(this.startedPlay == true)
    // {
    setTimeout(() => {
      videoplayer.nativeElement.pause();
      if (videoplayer.nativeElement.paused) {
        this.show = !this.show;
      }
    }, 5000);
    // }
  }

  //}
  ngOnDestroy() {
    localStorage.removeItem("allow1")
  }
  closebutton(videoplayer) {
    this.show = !this.show;
    videoplayer.nativeElement.play();
  }
}
