import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-crm-view',
  templateUrl: './crm-view.component.html',
  styleUrls: ['./crm-view.component.css']
})
export class CrmViewComponent implements OnInit {
  
  complainViewData: any[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['ComplainNo', 'date', 'awbno', 'type', 'status','Action'];

  constructor(private getData: AllServicesService,
              private snackBar: MatSnackBar,
              ) {}

  ngOnInit(): void {
    this.loadData();
  }

  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  loadData() {
    this.getData.getComplainView().subscribe((resp: any) => {
      this.complainViewData = resp.Data;
      this.dataSource = new MatTableDataSource(this.complainViewData);
      this.dataSource.paginator = this.paginator;
    });
  }
  deleteComplain(complainNo: string) {
    // const url = `${environment.apiUrl}Crm/deletecomplain?ComplainNo=${complainNo}`;
    this.getData.deletecomplain(complainNo).subscribe(
      (response: any) => { 
        if (response.status === 1) {
          this.openSnackBar( response.message, 'custom-snackbar')
          this.loadData();
        }else{
          this.openSnackBar(response.message, 'error-snackbar')
        }
      },(error) => {
        this.openSnackBar('Error occurred while deleting complaint', 'error-snackbar')
        console.error('Error occurred while deleting complaint', error);
      }
    );
  }
 
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
