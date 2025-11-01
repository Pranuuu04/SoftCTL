import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustChargFormComponent } from 'app/Branch/Shared/master-model/cust-charg-form/cust-charg-form.component';
import { CustomerChrgService } from '../customer-chrg-sevices/customer-chrg.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-metro-charges',
  templateUrl: './metro-charges.component.html',
  styleUrls: ['./metro-charges.component.css']
})
export class MetroChargesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog,private custChrgService:CustomerChrgService,private snackBar:MatSnackBar) { }
   
     ngOnInit(): void {
         this.getMetroChrgData();
     }
   
   
     openMetroCharForm(element) {
       const dialogRef = this.dialog.open(CustChargFormComponent, {
         data: {
           action: element ? 'MetroCharEdit' : 'MetroCharAdd',
           MetroCharData:  element || {},
           MetroCharMode: element ? 'edit' : 'add'
         },
         autoFocus: false,
         width: '45rem',
         disableClose: true
       });
       dialogRef.afterClosed().subscribe(()=> {
        this.getMetroChrgData();
       });
     }
   
     displayedColumns: string[] = ['Club_No' ,'Customer_Name', 'Product_Name','MetroCharges', 'NonMetroCharges' ,'Active_Date', 'Closing_Date','action'];
    
      columnHeaderMap: { [key: string]: string } = {
      Club_No: 'Club No',
      Customer_Name: 'Customer Name',
      Product_Name: 'Product Name',
      MetroCharges:'Metro Charges',
      NonMetroCharges:'Non Metro Charges',
      Active_Date:'Active Date',
      Closing_Date:'Closing Date',
    };
   
     dataSource = new MatTableDataSource<any>([]);
   
     getMetroChrgData(){
      this.custChrgService.getMetroCharge().subscribe((res:any)=>{
      if(res.status === 1){
          this.dataSource = new MatTableDataSource<any>(res.Data);
          this.dataSource.paginator = this.paginator;
      }else{
           // this.openSnackBar(res.message , 'custom-snackbar');
         this.openSnackBar(res.message , 'error-snackbar');
      }
      });
    }

    deleteMetroChrgData(element){
      this.custChrgService.deleteMetroCharge(element.Club_No).subscribe((res:any)=>{
        if(res.status === 1){
          this.openSnackBar(res.message , 'custom-snackbar');
          const index = this.dataSource.data.indexOf(element);
          if (index > -1) {
            const updatedData = [...this.dataSource.data];
            updatedData.splice(index, 1);
            this.dataSource.data = updatedData;
            if (updatedData.length === 0) {
              this.dataSource = new MatTableDataSource([]);
            }
            if (this.dataSource.paginator) {
              this.dataSource.paginator.firstPage();
            }
          }
        }else{
          this.openSnackBar(res.message , 'error-snackbar');
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
