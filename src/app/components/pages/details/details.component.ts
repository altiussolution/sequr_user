import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  video_path: any;
  video_url: any;

  constructor(public router: Router, private toast: ToastrService, private fb: FormBuilder, public crud: CrudService) {

  }
  @ViewChild('videoPlayer') videoplayer: ElementRef;

  toggleVideo(event: any) {
    console.log(event)
      this.videoplayer.nativeElement.play();
  }
  ngOnInit(): void {
    console.log(localStorage.getItem("_id"))
    this.crud.get(appModels.DETAILS + localStorage.getItem("_id")).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.items = res.items
      this.machine = res.machine
      this.it = this.machine.item
      this.qty = this.machine.quantity
      console.log(this.it)
      this.cube = this.machine.cube
      this.bin = this.machine.bin
      this.compartment = this.machine.compartment
      this.video_path=this.items.video_path
      //this.video_url = this.video_path.split('/').pop();
      console.log(this.video_path)
      console.log(this.video_url)

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

  addtocart() {
    if (this.qut && this.qut > 0) {
      let cart = {
        "item": this.machine.item,
        "total_quantity": this.qut,

      }

      this.crud.post(appModels.ADDTOCART, cart).subscribe(res => {
        console.log(res)
        this.toast.success("cart added successfully")
        this.crud.get(appModels.listCart).pipe(untilDestroyed(this)).subscribe(res => {
          console.log(res)
          if(res){
            this.crud.getcarttotal(res[0]?.length)
            this.router.navigate(['pages/mycart'])
          }

        }, error => {
          this.toast.error(error.message);
        })
      })
    } else {
      this.toast.error("please Enter QTY")
    }



  }
  //addtocard(){
  // this.router.navigate(['/pages/mycart']);

  //}
  ngOnDestroy() {
    localStorage.removeItem("allow1")
  }
}
