// import { Component, OnInit } from '@angular/core';
import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ZoneFormComponent } from 'app/Branch/Shared/master-model/zone-form/zone-form.component';
import { CategoryFormComponent } from 'app/Branch/Shared/whms-pages/category-form/category-form.component';
import { ItemMastFormComponent } from 'app/Branch/Shared/whms-pages/item-mast-form/item-mast-form.component';
import { RackFormComponent } from 'app/Branch/Shared/whms-pages/rack-form/rack-form.component';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

   sessionLocationCode: any;
       showTable = false;
       pageSize: number ;
       pageSizeOptions: number[] = [15, 50, 100, 1000];
       dataSource: MatTableDataSource<any>;
       @ViewChild(MatPaginator) paginator: MatPaginator;
       displayedColumns: any[] = [ 'action', 'Item_Code', 'Item_Name','Category_Code','Volume','Rate','Qty'];
       zoneViewData: any[] = [];
       showFirstLastButtons: any;
   
   
       constructor(public dialog: MatDialog,
                   private router: Router,
                   public httpService: HttpService,
                   public snackBar: MatSnackBar) {
  
                   }
   
       ngOnChanges(): void {
        
       }
   
       ngOnInit(): void {
           this.getItemMastData()
           
       }
   
       ngAfterViewInit(): void {}
   
       openItemMastForm(element) {
         const dialogRef = this.dialog.open(ItemMastFormComponent, {
           data: {
             action:element ? 'itemMastEdit' : 'itemMastAdd',
             itemMastData: element || {},
             itemMastMode:element ? 'edit' : 'add'
           },
           width: '30rem',
           disableClose: true
         });
         dialogRef.afterClosed().subscribe(res => {
           this.getItemMastData();
         });
       }

       
       getItemMastData(){
        this.httpService.get(`${environment.apiUrl}Master/ItemMast?masterName=Item&operation=getItem&itemCode=&itemName=&categoryCode=&volume=&rate=&qty=`).then((res: any) =>{
          console.log('formdata:', res.status);
          if (res.status == 1) {  
            //  this.dataSource = res.Data;
              this.dataSource = new MatTableDataSource(res.Data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.filterPredicate = (data: any, filter: string) => {
             return Object.values(data).some(val =>
                val?.toString().toLowerCase().includes(filter)
              );
             };
          } else {
            this.openSnackBar(res.message , 'custom-snackbar' );
            // alert(res.message)
          }
        });
       }
     
       deleteItemMast(element): void {
        this.httpService.get(`${environment.apiUrl}Master/ItemMast?masterName=Item&operation=deleteItem&itemCode=${element.S_no}&itemName=&categoryCode=&volume=&rate=&qty=`).then((res: any) =>{
          console.log('formdata:', res.status);
          if (res.status == 1) {  
            this.openSnackBar(res.message , 'custom-snackbar' );
            // this.getItemMastData()
            
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
  
          } else {
            this.openSnackBar(res.message , 'custom-snackbar' );
            // alert(res.message)
          }
        });
       }
     
       openSnackBar(message: string, panelClass) {
         this.snackBar.open(message, 'Close', {
           duration: 3000,
           horizontalPosition: 'right',
           verticalPosition: 'top',
           panelClass: [panelClass]
         });
       }
     
      //  applyFilter(filterValue: string) {
      //    this.dataSource.filter = filterValue.trim().toLowerCase();
      //    if (this.dataSource.paginator) {
      //      this.dataSource.paginator.firstPage();
      //    }
      //  }
  
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
  
}
