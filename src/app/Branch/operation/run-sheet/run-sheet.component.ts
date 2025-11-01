import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PendingDRSComponent } from './pending-drs/pending-drs.component';
import { DRSEntryComponent } from './drs-entry/drs-entry.component';
import { DRSViewComponent } from './drs-view/drs-view.component';

@Component({
  selector: 'app-run-sheet',
  templateUrl: './run-sheet.component.html',
  styleUrls: ['./run-sheet.component.css']
})
export class RunSheetComponent implements OnInit {

  @ViewChild(PendingDRSComponent) private pending: PendingDRSComponent;
  @ViewChild(DRSEntryComponent) private Entry: DRSEntryComponent;
  @ViewChild(DRSViewComponent) private View : DRSViewComponent;

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