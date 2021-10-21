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
  Previewimage: any;
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
  // imgPreviews: string[] = [];
  // sendimg(e){
  //   this.imgPreviews.push(e.target.src);
  //   this.Previewimage = e.target.src;
  // }

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
          if (res) {
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

  //}
  ngOnDestroy() {
    localStorage.removeItem("allow1")
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

  closebutton(videoplayer) {
    this.show = !this.show;
    videoplayer.nativeElement.play();
  }
}
