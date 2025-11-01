import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DirectDrsViewComponent } from './direct-drs-view/direct-drs-view.component';
import { DirectDrsPendingComponent } from './direct-drs-pending/direct-drs-pending.component';
import { DirectDrsEntryComponent } from './direct-drs-entry/direct-drs-entry.component';

@Component({
  selector: 'app-direct-runsheet',
  templateUrl: './direct-runsheet.component.html',
  styleUrls: ['./direct-runsheet.component.css']
})
export class DirectRunsheetComponent implements OnInit {

  @ViewChild(DirectDrsPendingComponent) private pending: DirectDrsPendingComponent;
  @ViewChild(DirectDrsEntryComponent) private Entry: DirectDrsEntryComponent;
  @ViewChild(DirectDrsViewComponent) private View : DirectDrsViewComponent;

  constructor() { }

  ngOnInit(): void {
  }
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      // case 0:
      //   this.pending.refresh(); 
      //   break;
      // case 1:
      //   this.Entry.refresh(); 
      //   break;
      // case 2:
      //   this.View.refresh(); 
      //   break;
    }
  }

}
