import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-cust-credit',
  templateUrl: './cust-credit.component.html',
  styleUrls: ['./cust-credit.component.css']
})
export class CustCreditComponent implements OnInit {

   createForm: FormGroup;
   sessionLocationCode: string ;
   showTable = false;
   userType: any;
   currentDate2: any;
   customerData: any;
  customerList: any;

   constructor( public dialog: MatDialog,
                public formBuilder: FormBuilder,
                public httpService: HttpService,
                public formbuilder: FormBuilder,
                private snackBar: MatSnackBar,
                public AllService: AllServicesService) {
                }

   ngOnInit(): void {
      this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
    this.AllService.getConsignerData(this.sessionLocationCode).subscribe((data: any) => {
      this.customerList = data.Data;
    });
    this.currentDate2 = new Date().toISOString().split('T')[0];

     this.createForm  = this.formbuilder.group({
      noteNo: new FormControl(''),
      Date: new FormControl('', Validators.compose([ Validators.required ])),
      Customer: new FormControl(''),
      Particulars: new FormControl(''),
      Remark: new FormControl(''),
      Amount: new FormControl('')
    });

   }

   refresh() {
    // this.loadCustomerData();
  }

   getDefaultDate(): string {
     const today = new Date();
     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
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

   openSnackBar(message: string, panelClass: string) {
     this.snackBar.open(message, 'Close', {
       duration: 3000,
       horizontalPosition: 'right',
       verticalPosition: 'top',
       panelClass: [panelClass]
     });
   }

 onSubmit() {}

}
