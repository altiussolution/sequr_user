import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  date: any;
  date1: any;
  arrayvalue:any=[]
  DataForm:FormGroup
  constructor(public crud:CrudService) { }
  ngOnInit(): void {
  this.crud.get(appModels.ITEMLIST).pipe(untilDestroyed(this)).subscribe((res:any) => {
      console.log(res)
      this.itemhistorycart=res['Cart'][0]['cart']
      this.date=res['Cart'][0]['updated_at']
      this.itemhistorykit=res['Kits'][0]["kitting"]
    
  })

  }
  passParams(event:any,val:any){
    if(event.target.checked){
      this.arrayvalue.push(val);
      }
    if (!event.target.checked) {
      let index = this.arrayvalue.indexOf(val);
    if (index > -1) {
      this.arrayvalue.splice(index, 1);
      }
    }
    console.log(this.arrayvalue)
  }
  delete(i:any){
    if (i > -1) {
      this.arrayvalue.splice(i, 1);
      }
  }
  myFunction(event,i){
console.log(event.target.id)
if(this.arrayvalue[i].qty>=event.target.value){

}else{
 (<HTMLInputElement>document.getElementById(event.target.id)).value="";
}
  }
  ngOnDestroy(){}
}
