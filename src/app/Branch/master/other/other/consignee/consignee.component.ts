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
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.css']
})
export class ConsigneeComponent implements OnInit {

  showTable: boolean;
  ConsigneeViewData: any[];
  pageSize: number ;
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
displayedColumns: string[] = [
  'index',
  'action',
  'Consignee_Name',
  'GSTNo',
  'Consignee_add1',
  'Consignee_add2',
  'Consignee_add3',
  'State_Name',
  'Customer_Name'
];

   constructor(private dialog: MatDialog,private snackBar:MatSnackBar,
               public masterService: MasterService
              ) { }

   ngOnInit(): void {
    this.getConsignee();
   }


   openConsigneeForm(element) {
     const dialogRef = this.dialog.open(OtherMastFormComponent, {
       data: {
         action: element ? 'ConsigneeEdit' : 'ConsigneeAdd',
         ConsigneeData:  element || {},
         ConsigneeMode: element ? 'edit' : 'add'
       },
       width: '60rem',
       disableClose: true
     });
     dialogRef.afterClosed().subscribe(() => {
      this.getConsignee();
     });
   }

  //  columnHeaderMap: { [key: string]: string } = {
  //   consigneeName: 'Consignee',
  //   companyName: 'companyName',
  //   contactPerson: 'contactPerson',
  //   address1: 'Address 1',
  //   address2: 'Address 2',
  //   landMark: 'Landmark',
  //   mobileNo: 'Contact No',
  //   emailId: 'Email ID',
  //   pinCode: 'Pin Code',
  //   cityNameShip: 'City',
  //   stateName: 'State',
  //   countryName: 'Country',
  //   gstNo: 'GST No',
  //   remark: 'Remark',
  //   srNo: 'Serial No',
  // };


 deleteConsigneeData(element): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '22rem',
        data: { message: `Are you sure you want to delete this ${element.Consignee_Name}?` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.masterService.DeleteShipperConsig( 'deleteConsignee', element.Consignee_Code).subscribe(
            (resp: any) => {
              if (resp.status === 1) {
                this.openSnackBar(resp.message, 'custom-snackbar');
                this.getConsignee();
              } else {
                this.openSnackBar(resp.message, 'error-snackbar');
              }
            },
            (error) => {
              console.error('Error deleting Consignee:', error);
              this.openSnackBar('Failed to delete Consignee', 'error-snackbar');
            }
          );
        }
      });
    }


  getConsignee() {
      this.masterService.getAndDeleteShipperConsig('getConsignee').subscribe((resp: any) => {
        if (resp.status === 1) {
          this.showTable = true;
          this.ConsigneeViewData = resp.Data;
          this.dataSource.data = this.ConsigneeViewData;
          this.dataSource.paginator = this.paginator;
        } else {
           this.showTable = false;
           this.ConsigneeViewData = [];
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
