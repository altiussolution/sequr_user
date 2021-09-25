import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CrudService } from 'src/app/services/crud.service';
import { appModels } from 'src/app/services/shared/enum/enum.util';

@Component({
  selector: 'app-itemhistory',
  templateUrl: './itemhistory.component.html',
  styleUrls: ['./itemhistory.component.scss']
})
export class ItemhistoryComponent implements OnInit {
  itemhistorycart: any=[];
  itemhistorykit: any=[];
  constructor(public crud:CrudService) { }
  ngOnInit(): void {
  this.crud.get(appModels.ITEMLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.itemhistorycart=res['Cart']
      this.itemhistorykit=res['Kits']
  })

  }
  ngOnDestroy(){}
}
