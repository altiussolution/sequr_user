import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from '../services/authentication/authentication.service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  loginForm: FormGroup;
  constructor( public router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,
    public authendication:AuthenticationService,) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required]
    })
   }

  ngOnInit(): void {
  }
  forgot(){
    if(this.loginForm.valid){
      let data = {
        "new_pass_req" : true
      }
      this.authendication.update2(`employee/updateForgotpassword/${this.loginForm.value.username}`, data).pipe(untilDestroyed(this)).subscribe(res=>{
       console.log(res)
      this.toast.success("Forgot password request sent to admin")
      },error=>{
      this.toast.error(error.message)
      })
      
    }else{
      this.toast.warning("please enter username")
    }
    
  }
  ngOnDestroy() {
    this.loginForm.reset("");
   }
}
