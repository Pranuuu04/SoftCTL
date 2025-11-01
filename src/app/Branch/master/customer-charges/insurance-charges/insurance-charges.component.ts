import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustChargFormComponent } from 'app/Branch/Shared/master-model/cust-charg-form/cust-charg-form.component';
import { CustomerChrgService } from '../customer-chrg-sevices/customer-chrg.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-insurance-charges',
  templateUrl: './insurance-charges.component.html',
  styleUrls: ['./insurance-charges.component.css']
})
export class InsuranceChargesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
   constructor(private dialog: MatDialog,private custChrgService:CustomerChrgService,private snackBar:MatSnackBar) { }
      
        ngOnInit(): void {
           this.getInsuranceChrgData();
        }
      
      
        openInsCharForm(element) {
          const dialogRef = this.dialog.open(CustChargFormComponent, {
            data: {
              action: element ? 'InsCharEdit' : 'InsCharAdd',
              InsCharData:  element || {},
              InsCharMode: element ? 'edit' : 'add'
            },
            autoFocus: false,
            width: '45rem',
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(()=> {
                this.getInsuranceChrgData();
          });
        }
      
        displayedColumns: string[] = ['Club_No', 'Customer_Name', 'Product_Name','InsurancePer', 'Active_Date', 'Closing_Date','action'];
      
        columnHeaderMap: { [key: string]: string } = {
        Club_No: 'Club_No',
        Customer_Name: 'Customer Name',
        Product_Name: 'Product Name',
        InsurancePer:'Insurance %',
        Active_Date:'Active Date',
        Closing_Date:'Closing Date',
      };
      
        dataSource = new MatTableDataSource<any>([]);
      
      
        getInsuranceChrgData(){
          this.custChrgService.getInsuranceCharge().subscribe((res:any)=>{
           if(res.status === 1){
              this.dataSource = new MatTableDataSource<any>(res.Data);
              this.dataSource.paginator = this.paginator;
           }else{
                // this.openSnackBar(res.message , 'custom-snackbar');
              this.openSnackBar(res.message , 'error-snackbar');
           }
          });
      }
   
      deleteInsuranceChrgData(element){
        this.custChrgService.deleteInsuranceCharge(element.Club_No).subscribe((res:any)=>{
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
