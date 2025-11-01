import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { allowedNodeEnvironmentFlags } from 'process';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { OtherMastFormComponent } from 'app/Branch/Shared/master-model/other-mast-form/other-mast-form.component';
import { MasterService } from 'app/Branch/master/master.service';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.css']
})
export class ShipperComponent implements OnInit {

  showTable: boolean;
  shipperViewData: any;
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // displayedColumns: string[] = [ 'action','shipperGSTNo','companyName','contactPerson', 'shipperAdd1', 'shipperAdd2', 'shipperEmail','shipperCity','stateName','countryName','shipperPhone','selectedShipper'];
displayedColumns: string[] = [
  'index',
  'action',
  'shipper_Name',
  'shipper_Code',
  'Add1',
  'Add2',
  'Add3',
  'State_Name',
  'Customer_Code'
];


  constructor(private dialog: MatDialog,private snackBar:MatSnackBar,
              public masterService: MasterService
  ) { }

  ngOnInit(): void {
  this.dataSource = new MatTableDataSource<any>(this.shipperViewData);
  this.getShipper();
  }


  openShipperForm(element) {
    const dialogRef = this.dialog.open(OtherMastFormComponent, {
      data: {
        action: element ? 'ShipperEdit' : 'ShipperAdd',
        ShipperData:  element || {},
        ShipperMode: element ? 'edit' : 'add'
      },
      width: '60rem',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getShipper();
    });
  }


  // columnHeaderMap: { [key: string]: string } = {
  //   shipperGSTNo: 'GST No',
  //   companyName: 'Company Name',
  //   contactPerson: 'Contact Person',
  //   shipperAdd1: 'Address 1',
  //   shipperAdd2: 'Address 2',
  //   shipperEmail: 'Email ID',
  //   shipperCity: 'City Name',
  //   stateName: 'State Name',
  //   countryName: 'Country Name',
  //   shipperPhone: 'Contact No',
  //   selectedShipper: 'Shipper Name',
  // };

  deleteShipperData(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete this ${element.shipper_Name}?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.masterService.DeleteShipperConsig( 'deleteShipper', element.shipper_Code).subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                this.getShipper();
              } else {
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting shipper:', error);
              this.openSnackBar('Failed to delete shipper', 'error-snackbar');
            }
          );
        }
      });
    }


 getShipper() {
     this.masterService.getAndDeleteShipperConsig('getShipper').subscribe((resp: any) => {
       if (resp.status === 1) {
         this.showTable = true;
         this.shipperViewData = resp.Data;
         this.dataSource.data = this.shipperViewData;
         this.dataSource.paginator = this.paginator;
       } else {
          this.showTable = false;
          this.shipperViewData = [];
          this.dataSource.data = [];
        }
     });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

}
