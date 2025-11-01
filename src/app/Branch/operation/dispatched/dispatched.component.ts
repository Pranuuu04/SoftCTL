import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PendingDispatchedComponent } from './pending-dispatched/pending-dispatched.component';
import { CreateDispatchedComponent } from './create-dispatched/create-dispatched.component';
import { ViewDispatchedComponent } from './view-dispatched/view-dispatched.component';

@Component({
  selector: 'app-dispatched',
  templateUrl: './dispatched.component.html',
  styleUrls: ['./dispatched.component.css']
})
export class DispatchedComponent implements OnInit {

  @ViewChild(PendingDispatchedComponent) private pending: PendingDispatchedComponent;
  @ViewChild(CreateDispatchedComponent) private Entry: CreateDispatchedComponent;
  @ViewChild(ViewDispatchedComponent) private View : ViewDispatchedComponent;

  constructor() { }

  ngOnInit(): void {
  }
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.pending.refresh(); 
        break;
      case 1:
        this.Entry.refresh(); 
        break;
      case 2:
        this.View.refresh(); 
        break;
    }
  }


}
