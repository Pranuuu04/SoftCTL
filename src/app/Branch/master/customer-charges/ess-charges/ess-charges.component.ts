import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustChargFormComponent } from 'app/Branch/Shared/master-model/cust-charg-form/cust-charg-form.component';
import { CustomerChrgService } from '../customer-chrg-sevices/customer-chrg.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ess-charges',
  templateUrl: './ess-charges.component.html',
  styleUrls: ['./ess-charges.component.css']
})
export class EssChargesComponent implements OnInit {

   @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog,private custChrgService:CustomerChrgService,private snackBar:MatSnackBar) { }
  
    ngOnInit(): void {
       this.getEssChrgData();
    }
  
  
    openEssCharForm(element) {
      const dialogRef = this.dialog.open(CustChargFormComponent, {
        data: {
          action: element ? 'EssCharEdit' : 'EssCharAdd',
          EssCharData:  element || {},
          EssCharMode: element ? 'edit' : 'add'
        },
        autoFocus: false,
        width: '45rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(()=> {
        this.getEssChrgData();
      });
    }
  
    displayedColumns: string[] = ['Fuel_Code','Customer_Name', 'Product_Name','FuelCharges', 'Active_Date', 'Closing_Date','action'];
  
    columnHeaderMap: { [key: string]: string } = {
    Fuel_Code: 'ClubNo',
    // Club_No: 'ClubNo',
    Customer_Name: 'Customer Name',
    Product_Name: 'Product Name',
    FuelCharges: 'Miscellaneous Charge',
    Active_Date:'Active Date',
    Closing_Date:'Closing Date',
  };
  
    dataSource = new MatTableDataSource<any>([]);


      getEssChrgData(){
        this.custChrgService.getEssCharge().subscribe((res:any)=>{
        if(res.status === 1){
            this.dataSource = new MatTableDataSource<any>(res.Data);
            this.dataSource.paginator = this.paginator;
        }else{
           // this.openSnackBar(res.message , 'custom-snackbar');
         this.openSnackBar(res.message , 'error-snackbar');
        }
        });
      }

    deleteEssChrgData(element){
      this.custChrgService.deleteEssCharge(element.Fuel_Code).subscribe((res:any)=>{
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
