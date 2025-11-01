import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { SharedService } from 'app/service/shared.service';
import { TripService } from '../trip.service';

@Component({
  selector: 'app-view-tripsheet',
  templateUrl: './view-tripsheet.component.html',
  styleUrls: ['./view-tripsheet.component.css']
})
export class ViewTripsheetComponent implements OnInit {

  @Output() editTripEvent = new EventEmitter<any>();

   createForm: FormGroup;
   validationMessage: any = [];
   sessionLocationCode: string ;
   isLoading = false;
   destination: any = '';
  //  pageSizeOptions: number[] = [5, 10, 25, 100];
  //  pageSize = 10 ;
  //  pageNumber = 1;
   // tslint:disable-next-line:max-line-length
  //  displayedColumns: any[] = ['shipment', 'manifestNo', 'manifestDt', 'todest', 'mode', 'SumQty', 'sumActualWt', 'vehicleNo', 'driverName']; //'Action'
   displayedColumns: string[] = ['index', 'action','TripDate', 'TripNo', 'AwbNo', 'supplierName', 'VehicleNo', 'DriverName', 'Route', 'OriginName', 'DestinationName'];//'vehicleType','DriverNo','Action'
   dataSource = new MatTableDataSource<any>();
   @ViewChild(MatPaginator) paginator: MatPaginator;
   DestinationName: any;
   firstOfMonth: any;
   currentDate1: any;
   currentDate2: any;
   selectedValue: string;
   userType: any;
   CustomerList: any;


   length = 0;
   pageSize = 10;
   pageIndex = 0;
   pageCount = 0;
   pageEvent: PageEvent;
   hidePageSize = false;
   disabled = false;
   showPageSizeOptions = false;

   constructor( public dialog: MatDialog,
                private sharedService: SharedService,
                public formBuilder: FormBuilder,
                public httpService: AllServicesService,
                public formbuilder: FormBuilder,
                public tripservice: TripService,
                private snackBar: MatSnackBar, ) {
                this.isLoading = false;
                }

    ngOnInit(): void {
    //  this.userType = localStorage.getItem('userType');

    //  this.selectedValue = this.sharedService.getSelectedValue();
    //  this.sessionLocationCode = localStorage.getItem('originCode');
        this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');

      this.currentDate1 = new Date().toISOString().split('T')[0];
       this.currentDate2 = new Date().toISOString().split('T')[0];
  this.httpService.getConsignerData(this.sessionLocationCode).subscribe((resp: any) => {
      this.CustomerList = resp.Data;
     });
     this.createForm  = this.formbuilder.group({
       fromDate: new FormControl('', Validators.compose([
         Validators.required
         ])),
       toDate: new FormControl('', Validators.compose([
         Validators.required
       ])),
       TripNo: new FormControl('', Validators.compose([
         Validators.required
       ])),
       custName: new FormControl('', Validators.compose([
         Validators.required
       ])),
     });
     }
     refresh() {
     }

     getDefaultDate(): string {
       const today = new Date();
       const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
       console.log("firstDayOfMonth",firstDayOfMonth)
       return this.formatDate(firstDayOfMonth);
     }

     formatDate(date: Date): string {
       const year = date.getFullYear();
       const month = date.getMonth() + 1;
       const day = date.getDate();
       return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
     }

     getCurrentDate(): string {
       const today = new Date();
       return this.formatDate(today);
     }

     getTripSheetData(){
     
      this.tripservice.getTripSheetDataa('ViewTrip',this.sessionLocationCode,this.createForm.value.fromDate,this.createForm.value.toDate,this.createForm.value.TripNo,this.createForm.value.custName,this.pageIndex + 1,this.pageSize).subscribe((res:any)=>{
              if(res.status === 1){
                  this.dataSource = new MatTableDataSource<any>(res.Data);
                  this.length = res.count;
                  console.log("Count>>>",this.length)
              }else{
                // this.snackBar.open(res.message, 'error')
                this.openSnackBar(res.message, 'error-snackbar');
              }
      });
     }

  editTrip(TripNo:any){
    this.tripservice.getTripSheetDataa('ViewTripNo',this.sessionLocationCode,this.createForm.value.fromDate,this.createForm.value.toDate,TripNo,'',1,this.pageSize).subscribe((res:any)=>{
      if(res.status === 1){
        this.editTripEvent.emit(res.Data[0]);
        
      }else{
        // this.snackBar.open(res.message, 'error')
        this.openSnackBar(res.message, 'error-snackbar');
      }
       
     });

     }


 

  deleteTrip(TripNo:any){
    this.tripservice.getTripSheetDataa('DeleteTripNo',this.sessionLocationCode,'','',TripNo,'',1,10).subscribe((res:any)=>{
      if(res.status === 1){
          this.dataSource = new MatTableDataSource<any>(res.Data);
          this.getTripSheetData();
      }else{
        // this.snackBar.open(res.message, 'error')
        this.openSnackBar(res.message, 'error-snackbar');
      }
     });

     }


printTrip(sessionLocationCode:any,TripNo:any,AwbNo:any) {
  const printData = {
    sessionLocationCode:sessionLocationCode,
    AwbNo:AwbNo,
    TripNo:String(TripNo)
  }
  this.tripservice.getTripPDF(printData).subscribe((response: Blob) => {
    let url;
    if(response){
    const blob = new Blob([response], { type: 'application/pdf' });
     url = window.URL.createObjectURL(blob);
     window.open(url);

    // const newWindow = window.open(url);  
    // if (newWindow) {
    //   newWindow.onload = () => {
    //     newWindow.print();
    //   };

    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `Trip_${TripNo}.pdf`;
      link.click();
    }
  }, error => {
    console.error('Error fetching PDF:', error);
    this.openSnackBar('Failed to generate PDF', 'error-snackbar');
  });
}  

calculatePageCount() {
  this.pageCount = Math.ceil(this.length / this.pageSize);
  console.log(this.pageCount, 'pageCount');
}

onPageChange(event: PageEvent) {
  this.length = event.length;
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.getTripSheetData();
  this.calculatePageCount();
}
   

  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

 applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }

}
