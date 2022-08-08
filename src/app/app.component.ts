import { Component, OnInit,OnChanges,SimpleChanges,Inject,Input} from '@angular/core';
import { CrudService } from './services/crud.service';
import TurtleDB from 'turtledb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit   {
  mySubjectVal: any=[];
  title = 'sequr-user';
  mydb: any;
  constructor(public crud:CrudService) { }
  ngOnInit(): void {

    if(window.navigator.onLine == true){
      console.log(window.navigator.onLine)
      this.mydb = new TurtleDB('example');
      this.mydb.setRemote('http://13.232.128.227:3000');
      this.mydb.create({ _id: 'sync', data: ' Synced' });

      this.mydb.sync();
      // if(this.mydb.sync()){
      //   alert("synced")

      // }
    }
    else{
      console.log(window.navigator.onLine)
    }
    
  
  }
 
  

}
