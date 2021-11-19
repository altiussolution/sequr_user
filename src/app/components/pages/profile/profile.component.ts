import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
//import { NgxSpinnerService } from "ngx-spinner";  


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  cpForm: FormGroup;
  date=new Date()

  profiledetails: any = [];
  profile: any = [];
  language: any = [];
  lan: any;
    toggle1: boolean = false;
  citylist: any=[];
  toggle2: boolean =false;

  changeType1(input_field_password){
    if(input_field_password.type=="password")
    {input_field_password.type = "text";}
  else
    {input_field_password.type = "password";}
    this.toggle1 = !this.toggle1;

  }
  changeType2(input_field_password){
    if(input_field_password.type=="password")
    {input_field_password.type = "text";}
  else
    {input_field_password.type = "password";}

    this.toggle2 = !this.toggle2;

  }
  constructor(public crud: CrudService, public router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,//private spinner: NgxSpinnerService
  ) {
    this.cpForm = this.fb.group({
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.profiledetails = JSON.parse(localStorage.getItem('personal'))
    console.log(this.profiledetails._id)
    this.crud.get(appModels.USERPROFILE + this.profiledetails._id).pipe(untilDestroyed(this)).subscribe((res: any) => {
      console.log(res)
      this.profile = res['data']
      console.log(this.profile['language_prefered'])
      console.log(this.profile['country_id'])
      // 618e885163d6f1fed0dfdb9f
      console.log(this.profile['state_id'])
      // 618e885263d6f1fed0dfedc0
      this.crud.get(appModels.CITYLIST + "618e885163d6f1fed0dfdb9f" + "/" + "618e885263d6f1fed0dfedc0").pipe(untilDestroyed(this)).subscribe((res: any) => {
        console.log(res)
     this.citylist = res['list']
console.log(this.citylist)
      })
      this.crud.get(appModels.LAN).pipe(untilDestroyed(this)).subscribe((res: any) => {
        console.log(res)
        this.language = res['list']
          console.log(this.profile['language_prefered'])
        for (let i = 0; i < this.language.length; i++) {
          if (this.language[i]._id == this.profile['language_prefered']) {
           this.lan = this.language[i]
          }
        }
        console.log(this.lan)
      })
    })
 
   

  }
  changepwd() {
   // this.spinner.show();
    let data = {
      "oldpassword": this.cpForm.value.oldpassword,
      "newpassword": this.cpForm.value.newpassword
    }
    console.log(data)
    if (this.cpForm.valid) {
    if(this.cpForm.value.oldpassword ==this.cpForm.value.newpassword){
      this.toast.error('Old password and New password is same,Please enter valid New password')
    }else{
    this.crud.post(appModels.CHANGEPWD + this.profiledetails._id, data).subscribe(res => {
      console.log(res)
        this.toast.success('Password changed successfully')
      localStorage.clear();
      this.router.navigate(['/login'])
    },(error:HttpErrorResponse)=>{
      if(error.status === 422){  
        this.toast.error('Current password is incorrect')
      }
    })
  }
  }
  //this.spinner.hide();
  }
  ngOnDestroy() { }

}
