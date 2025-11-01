import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UnloadingBulkComponent } from 'app/Branch/Shared/inscan pages/unloading-bulk/unloading-bulk.component';

@Component({
  selector: 'app-unloading-tally',
  templateUrl: './unloading-tally.component.html',
  styleUrls: ['./unloading-tally.component.css']
})
export class UnloadingTallyComponent implements OnInit {

  constructor(public dialog: MatDialog ) { }

  ngOnInit(): void {
  }
  
  openUnloadingBulkModal(){
    const dialogRef = this.dialog.open(UnloadingBulkComponent, {
      data: {
        action: 'add'
      },
      width: '90rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      }
    });

  }

}
