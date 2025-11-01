import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-multizone',
  templateUrl: './multizone.component.html',
  styleUrls: ['./multizone.component.css']
})
export class MultizoneComponent implements OnInit {
 
  sessionLocationCode: any;
  showTable = false;
  pageSize: number ;
  pageSizeOptions: number[] = [15,50,100,1000];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'action','awbNo', 'bookDate'];
  ManifestViewData: any[] = []; 
  showFirstLastButtons: any;

  constructor(private http: AllServicesService,
              public dialog :MatDialog,
              public masterService: MasterService
              ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.ManifestViewData);
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.pendingTableData(1, 15);
  }

  pendingTableData(pageNumber: number, pageSize: number){
     this.http.getpendingDispatch(this.sessionLocationCode ,pageNumber ,pageSize).subscribe((resp:any)=>{
       if (resp.status === 1){
         this.showTable =true;
         this.ManifestViewData = resp.Data;
          this.dataSource.data = this.ManifestViewData;
         this.dataSource.paginator = this.paginator;
       }
     });
  }

  openMultizoneForm() {
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        action: 'MultizoneAdd'
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
      
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
