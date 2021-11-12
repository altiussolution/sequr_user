import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { appModels } from '../services/shared/enum/enum.util';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from '../services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var google
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  toggle1: boolean = false;
  myform:FormGroup;
  @ViewChild('closebutton') closebutton;
  profiledetails: any=[];
  language: any=[];
  changeType(input_field_password){
    if(input_field_password.type=="password")
    {input_field_password.type = "text";}
  else
    {input_field_password.type = "password";}

    this.toggle1 = !this.toggle1;
  }
  constructor(
    public router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,
    public authendication:AuthenticationService,
    public crud: CrudService) {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
      this.myform = this.fb.group({
        username : ['', Validators.required]
      })
     }
  ngOnInit(): void {
  }
  signin(){
    let data={
      "employee_id" : this.loginForm.value.username,
      "password" :  this.loginForm.value.password
  }
  console.log(data)
    this.authendication.post(appModels.LOGIN,data).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      if(res.status === true){  
      localStorage.setItem("personal",JSON.stringify(res))
     localStorage.setItem("JWTokens",res['token'])

     new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
     this.delete_cookie("googtrans")
       this.profiledetails = JSON.parse(localStorage.getItem('personal'))
       var Okay=this.profiledetails.role_id.permission.find(temp=>temp=="machine_permission")
       var Okay2=this.profiledetails.role_id.permission.find(temp=>temp=="user")
       if(Okay && Okay2){
        console.log(this.profiledetails?.language_prefered)
        this.crud.get(appModels.LAN).pipe(untilDestroyed(this)).subscribe((res: any) => {
            console.log(res)
            if(res){
              this.language = res['list']
              let data= this.language.find(x => x._id === this.profiledetails?.language_prefered)
              console.log(data?.code)
              this.setCookie("googtrans", "/en/"+data?.code);
            }else{
              this.setCookie("googtrans", "/en/en");
            }
           
            this.toast.success("Logged in Successfully")
            this.router.navigate(['/pages/home'])
        })
       }else {
         this.toast.error("Permission Denied,Please Contact Admin")
       }
      
      }else{
        this.toast.error("Admin block your account,Please contact Admin")
      }
    /*}
      ,(error:HttpErrorResponse)=>{
        if(error.status === 400){  
          this.toast.error('Invalid Credentials or No user found')
        }*/
     
    },error=>{
      this.toast.error("Invalid Username/Password")
    })
  }
  okay(){
    if(this.myform.valid){
      let data = {
        "new_pass_req" : true
      }
      this.authendication.update2(`employee/updateForgotpassword/${this.myform.value.username}`, data).pipe(untilDestroyed(this)).subscribe(res=>{
console.log(res)
      })
      this.toast.success("Forgot password request sent to admin")
      this.closebutton.nativeElement.click();
    }else{
      this.toast.warning("please enter username")
    }
    
  }
  ngOnDestroy() { }

   setCookie(name,value,) {
   document.cookie = name + "=" + value;   
}
   delete_cookie(name) {
   document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

}



