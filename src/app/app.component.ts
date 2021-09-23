import { Component, OnInit,OnChanges,SimpleChanges,Inject,Input} from '@angular/core';
import { CrudService } from './services/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit   {
  mySubjectVal: any=[];
  title = 'sequr-user';
  constructor(public crud:CrudService) { }
  ngOnInit(): void {
    // this.crud.getObservable().subscribe((data) => {
    //   console.log('Data received', data['foo']);
    //   this.mySubjectVal= data['foo']
    //   console.log('Data received', this.mySubjectVal);
    // })
  }
 
  

}
