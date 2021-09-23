import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profiledetails: any=[];
  profile: any=[];

  constructor(public crud:CrudService) { }

  ngOnInit(): void {
   this.profiledetails=JSON.parse( localStorage.getItem('personal'))
    this.crud.get(appModels.USERPROFILE+this.profiledetails._id).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.profile=res['data']
    })
  }
ngOnDestroy(){}

}
