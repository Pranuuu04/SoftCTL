import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustChargFormComponent } from 'app/Branch/Shared/master-model/cust-charg-form/cust-charg-form.component';
import { CustomerChrgService } from '../customer-chrg-sevices/customer-chrg.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ens-charges',
  templateUrl: './ens-charges.component.html',
  styleUrls: ['./ens-charges.component.css']
})
export class EnsChargesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
 constructor(private dialog: MatDialog,private custChrgService:CustomerChrgService,private snackBar:MatSnackBar) { }
   
     ngOnInit(): void {
         this.getEnsChrgData();
     }
   
   
     openEnsCharForm(element) {
      const relatedDestinations = this.dataSource.data.filter(row => row.Club_No === element?.Club_No);
       const dialogRef = this.dialog.open(CustChargFormComponent, {
         data: {
           action: element ? 'EnsCharEdit' : 'EnsCharAdd',
           EnsCharData:  element || {},
           EnsCharMode: element ? 'edit' : 'add',
           allDestinations: relatedDestinations.map(item => item.Destination_Code),
         },
         autoFocus: false,
         width: '45rem',
         disableClose: true
       });
       dialogRef.afterClosed().subscribe(()=> {
        this.getEnsChrgData();
       });
     }
   
     displayedColumns: string[] = ['Club_No','Customer_Name','Destination_Name', 'ENSPer', 'Weight','Amount','Active_Date', 'Closing_Date','action'];
   
     columnHeaderMap: { [key: string]: string } = {
      Club_No: 'Club No',
     Customer_Name: 'Customer Name',
     Destination_Name:'Destination Name',
    //  Product_Code: 'Product Code',
     ENSPer:'ENS %',
     Weight:'Weight',
     Amount:'Amount',
     Active_Date:'Active Date',
     Closing_Date:'Closing Date',
   };
   
     dataSource = new MatTableDataSource<any>([]);

          getEnsChrgData(){
            this.custChrgService.getEnsCharge().subscribe((res:any)=>{
            if(res.status === 1){
                this.dataSource = new MatTableDataSource<any>(res.Data);
                this.dataSource.paginator = this.paginator;
            }else{
              this.openSnackBar(res.message , 'error-snackbar');
            }
            });
         }

      deleteEnsChrgData(element){
       
        this.custChrgService.deleteEnsCharge(element.Club_No).subscribe((res:any)=>{
          if(res.status === 1){
             this.openSnackBar(res.message , 'custom-snackbar');
             const index = this.dataSource.data.indexOf(element);
            //  if (index > -1) {
            //    const updatedData = [...this.dataSource.data];
            //    updatedData.splice(index, 1);
            //    this.dataSource.data = updatedData;
            //    if (updatedData.length === 0) {
            //      this.dataSource = new MatTableDataSource([]);
            //    }
            //    if (this.dataSource.paginator) {
            //      this.dataSource.paginator.firstPage();
            //    }
            //  }
            const updatedData = this.dataSource.data.filter(row => row.Club_No !== element.Club_No);
            this.dataSource.data = updatedData;
            if (updatedData.length === 0) {
              this.dataSource = new MatTableDataSource([]);
            }
            if (this.dataSource.paginator) {
              this.dataSource.paginator.firstPage();
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
