import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { appModels } from '../services/shared/enum/enum.util';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,
    public authendication:AuthenticationService) {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
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
      localStorage.setItem("personal",JSON.stringify(res))
     localStorage.setItem("JWTokens",res['token'])
     this.toast.success("Logged in Successfully")
    this.router.navigate(['/pages/home'])
    },error=>{
      
    })
  
    
  }
  ngOnDestroy() { }
}



