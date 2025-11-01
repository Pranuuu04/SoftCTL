import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { BookMultiplePrintComponent } from '../book-multiple-print/book-multiple-print.component';
import { SharedService } from 'app/service/shared.service';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';

@Component({
  selector: 'app-book-print',
  templateUrl: './book-print.component.html',
  styleUrls: ['./book-print.component.css']
})
export class BookPrintComponent implements OnInit {

  sessionLocationCode: string;
  ClientLogo: string;
  ClientName: string;
  awbNo: string;
  printType: any = 'print';
  multiplePrintTpye: any;
  userType: string;
  selectedValue: string;
  CompanyPrint: any;
  companyCode: any;
  companyObj: any[] = [];
  // awbNO: any;
  isFormSubmitted = false;

  constructor(private _mdr: MatDialogRef<BookPrintComponent>,
              public dialog: MatDialog,
              private httpclient: HttpClient,
              private sharedService: SharedService,
              @Inject(MAT_DIALOG_DATA) public data: any ) {
                // if (data.bookingNumber) {
                  // this.awbNo = data.bookingNumber;
                  // console.log( 'awbNo    : ' , this.awbNo);
                // }
              }

  ngOnInit(): void {
     this.awbNo = this.data?.bookingNumber ?? '';
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
    ? localStorage.getItem('originCode')
    : localStorage.getItem('selectedValue');


    // this.sessionLocationCode = localStorage.getItem('originCode');
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.ClientName = localStorage.getItem('ClientName');
    this.userType = localStorage.getItem('userType');
    // this.selectedValue = this.sharedService.getSelectedValue();
    this.CompanyPrint = localStorage.getItem('CompanyPrint');
    if (Number(this.CompanyPrint) === 1) {
    this.getCompany();
  }
    }

  CloseDialog() {
    this._mdr.close(false);
  }

    getCompany() {
       this.httpclient.get(`${environment.apiUrl}Booking/getCompany`).subscribe((res: any) => {
           if (res.status === 1) {
              this.companyObj = res.Data;
                if (Number(this.CompanyPrint) === 1 && this.companyObj.length > 0) {
                  this.companyCode = this.companyObj[2].CompanyCode;
                }
           } else {
            alert('Error fetching data. Please try again.');
           }
       })
  }
  // printPDF() {
  //   if (!this.awbNo) {
  //     alert('Please enter Awb No before printing.');
  //     return;
  //   }

  //   let PdfUrl = '';
  //   let obj: any = {
  //     sessionLocationCode: this.sessionLocationCode,
  //     awbNo: this.awbNo,
  //   };

  //   if (this.multiplePrintTpye === 'Shipper' || this.multiplePrintTpye === 'getPerformaInvoice') {
  //     PdfUrl = this.multiplePrintTpye === 'Shipper'
  //       ? `${environment.apiUrl}Booking/getShipperConsigneePrint`
  //       : `${environment.apiUrl}Booking/getPerformaInvoice`;
  //   } else {
  //     PdfUrl = this.multiplePrintTpye === 'ShipperCopy'
  //       ? `${environment.apiUrl}Booking/getShipperCopyPrint`
  //       : `${environment.apiUrl}Booking/getDocketPrint`;
  //     obj = {
  //       sessionLocationCode: this.sessionLocationCode,
  //       awbNo: this.awbNo,
  //       logolink: this.ClientLogo,
  //       companyName: this.ClientName,
  //     };
  //   }

  //   console.log(obj, 'print object');

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   this.httpclient.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe(
  //     (blob: Blob) => {
  //       this.CloseDialog();
  //       console.log('API Response:', blob);
  //       if (blob.size === 39) {
  //         alert('No data available for the entered AWB No.');
  //         return;
  //       }
  //       const blobUrl = URL.createObjectURL(blob);
  //       window.open(blobUrl, '_blank');
  //     },
  //     (error) => {
  //       console.error('API Error:', error);
  //       alert('Error fetching data. Please try again.');
  //     }
  //   );
  // }
  Excelprogressbar(): MatDialogRef<ProgressBarComponent> {
       const dialogRef = this.dialog.open(ProgressBarComponent, {
         data: {
           action: 'docketPrint',
         },
         width: '20rem',
         disableClose: true
       });

       return dialogRef;
     }
 printPDF() {

      this.isFormSubmitted = true;
    if (!this.awbNo) {
      alert('Please enter Awb No before printing.');
      return;
    }

  const dialogRef = this.Excelprogressbar();
    let PdfUrl = '';
    const obj: any = {
      sessionLocationCode: this.sessionLocationCode,
      awbNo: this.awbNo,
    };

    if (this.multiplePrintTpye === 'Shipper' || this.multiplePrintTpye === 'getPerformaInvoice') {
      PdfUrl = this.multiplePrintTpye === 'Shipper'
        ? `${environment.apiUrl}Booking/getShipperConsigneePrint`
        : `${environment.apiUrl}Booking/getPerformaInvoice`;
    } else {
      PdfUrl = this.multiplePrintTpye === 'ShipperCopy'
        ? `${environment.apiUrl}Booking/getShipperCopyPrint`
        : `${environment.apiUrl}Booking/getDocketPrint`;
      // obj = {
      //   sessionLocationCode: this.sessionLocationCode,
      //   awbNo: this.awbNo,
      //   logolink: this.ClientLogo,
      //   companyCode: this.companyCode,
      //   companyFlag: Number(this.CompanyPrint),
      // };
        obj.logolink = this.ClientLogo;

    if (Number(this.CompanyPrint) === 1) {
      obj.companyCode = this.companyCode;
      obj.companyFlag = 1;
    } else {
      obj.companyFlag = 0;
    }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpclient.post(PdfUrl, obj, { headers: headers, responseType: 'blob' as 'json' }).subscribe(
      (blob: Blob) => {
        this.CloseDialog();
         dialogRef.close();
        console.log('API Response:', blob);
        if (blob.size === 39) {
          alert('No data available for the entered AWB No.');
          return;
        }

      const blobUrl = URL.createObjectURL(blob);
      const fileName = `Docket_Print_${this.awbNo}.pdf`;
      // window.open(blobUrl, '_blank');
 const pdfWindow = window.open(blobUrl, '_blank');
      if (pdfWindow) {
        pdfWindow.document.title = `Docket Print - ${this.awbNo}`;
      }
        const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      setTimeout(() => {
        if (navigator.share && navigator.canShare?.({ files: [new File([blob], fileName, { type: 'application/pdf' })] })) {
          const file = new File([blob], fileName, { type: 'application/pdf' });
          navigator.share({
            title: 'AWB PDF',
            text: 'Here is the docket',
            files: [file],
          }).catch(err => console.error('Share canceled or failed:', err));
        }
      }, 1000);
      },
      (error) => {
         dialogRef.close();
        console.error('API Error:', error);
        alert('Error fetching data. Please try again.');
      }
    );
  }

  searchPrintData() {
    const dialogRef = this.dialog.open(BookMultiplePrintComponent, {
      data: {
        action: 'add',
        awbNo : this.awbNo,
        printType : this.multiplePrintTpye
      },
      width: '100rem',
      disableClose: true,
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.CloseDialog();
      }
    });
  }
}
