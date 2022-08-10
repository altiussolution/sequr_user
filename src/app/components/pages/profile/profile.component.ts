import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
//import { NgxSpinnerService } from "ngx-spinner";  
import TurtleDB from 'turtledb';
declare const window:any;

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
  detect: any;

  connectionStatus: string;
  mydb: any;
  networkStatus: any;
  base64Image: string;
  onoff: boolean;
  profilepic: any;
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
   this.getprofile()
}
getprofile(){
  if(window.navigator.onLine == true){
    this.onoff=true
  this.crud.get(appModels.USERPROFILE + this.profiledetails._id).pipe(untilDestroyed(this)).subscribe((res: any) => {
    console.log(res)
    this.profile = res['data']
    console.log(this.profile)
    console.log(this.profile['language_prefered']['language'])
    this.mydb = new TurtleDB('example');
    this.mydb.setRemote('http://13.232.128.227:3000');
    this.mydb.create({ _id: 'profile', users: res.data });
    //alert("sync")
      this.mydb.sync();
      if(this.mydb.sync()){
        alert("syncedon")

      }
    const img=this.profile.profile_pic
    console.log(img)
    this.getBase64ImageFromURL(img).subscribe(base64data => {    
      console.log(base64data);
      this.base64Image = 'data:image/jpg;base64,' + base64data;
      console.log(this.base64Image)
      this.mydb = new TurtleDB('example');
      this.mydb.create({ _id: 'profilepic', data: this.base64Image });
    });
    // this.crud.get(appModels.LAN).pipe(untilDestroyed(this)).subscribe((res: any) => {
    //   console.log(res)
    //   this.language = res['list']
    //     console.log(this.profile['language_prefered'])
    //   for (let i = 0; i < this.language.length; i++) {
    //     if (this.language[i]._id == this.profile['language_prefered']) {
    //      this.lan = this.language[i]
    //     }
    //   }
    //   console.log(this.lan)
    // })
  })
}else{
  this.onoff=false
  this.mydb = new TurtleDB('example');
 // this.mydb.setRemote('http://13.232.128.227:3000');
  //this.mydb.setRemote('http://127.0.0.1:3000');

      this.mydb.read('profile').then((doc) =>{console.log(doc)
          this.profile = doc.users
          console.log(this.profile)
        } );
        this.mydb.read('profilepic').then((doc) =>{console.log(doc)
          this.profilepic = doc.data
          console.log(this.profilepic)
        } );

        // this.mydb.sync();
        // if(this.mydb.sync()){
        //   alert("syncedoff")
  
        // }
}
}
getBase64ImageFromURL(url: string) {
  console.log("its coming")
  return Observable.create((observer: Observer<string>) => {
    // create an image object
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
      img.onerror = (err) => {
         observer.error(err);
      };
    } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
    }
  });
}
getBase64Image(img: HTMLImageElement) {
 // We create a HTML canvas object that will create a 2d image
 var canvas = document.createElement("canvas");
 canvas.width = img.width;
 canvas.height = img.height;
 var ctx = canvas.getContext("2d");
 // This will draw image    
 ctx.drawImage(img, 0, 0);
 // Convert the drawn image to Data URL
 var dataURL = canvas.toDataURL("image/png");
return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


  changepwd() {
   // this.spinner.show();
    let data = {
      "oldpassword": this.cpForm.value.oldpassword,
      "newpassword": this.cpForm.value.newpassword
    }
    // let dataa={
    //   "oldpassword": this.cpForm.value.oldpassword,
    //   "newpassword": this.cpForm.value.newpassword,
    //   "id": this.profiledetails._id
    // }
    // this.mydb = new TurtleDB('example');
    // this.mydb.create({ _id: 'changepwd', data: dataa });
    // console.log(data)
    if (this.cpForm.valid) {
    if(this.cpForm.value.oldpassword ==this.cpForm.value.newpassword){
      this.toast.error('Old password and New password is same,Please enter valid New password')
    }else{
   // if(window.navigator.onLine == true){
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
  // }else{
  //   this.mydb = new TurtleDB('example');
  //     this.mydb.update('changepwd', { data: data });
  //     this.toast.success('Password changed successfully')
  //    // this.mydb.setRemote('http://127.0.0.1:3000');
  //   // this.mydb.sync();
  // }
}
  }
  //this.spinner.hide();
  }

  ngOnDestroy() { 


  }

}
