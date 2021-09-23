
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subcategories: any=[];
  message: any;
  constructor(public crud:CrudService) { }

  ngOnInit(): void {
    this.crud.CurrentMessage.subscribe(message=>{
      this.message=message
      this.crud.get(appModels.SUBCATEGORY+this.message).pipe(untilDestroyed(this)).subscribe((res:any) => {
        console.log(res)
        this.subcategories=res['data']
      })
    })
   
}

ngOnDestroy(){}
}
