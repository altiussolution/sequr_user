import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
declare var google
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  profiledetails: any;
  language: any;

  constructor(public crud:CrudService,public router:Router) { }

  ngOnInit(): void {
    this.googleTranslateElementInit()
  }
  googleTranslateElementInit() {

    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    this.delete_cookie("googtrans")
      this.profiledetails = JSON.parse(localStorage.getItem('personal'))
      console.log(this.profiledetails?.language_prefered)
      this.crud.get(appModels.LAN).pipe(untilDestroyed(this)).subscribe((res: any) => {
          console.log(res)
          this.language = res['list']
          let data= this.language.find(x => x._id === this.profiledetails?.language_prefered)
          console.log(data.code)
          this.setCookie("googtrans", "/en/"+data.code);
      })
  
   
   
 }
   setCookie(name,value,) {
   document.cookie = name + "=" + value;

}
   delete_cookie(name) {
   document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
ngOnDestroy(){}
}
