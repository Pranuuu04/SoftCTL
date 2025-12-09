import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TripService } from 'app/Branch/operation/tripsheet/trip.service';
import { PaymentService } from 'app/Branch/Payment/payment.service';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})

export class PaymentFormComponent implements OnInit {
  NoteNo: any;
  Ref_Club: any;
  RateEdit: any;
  creditNoteForm: FormGroup;
  paymentEntryForm: FormGroup;
  WalletEntryForm: FormGroup;
  paymentEntryBillForm: FormGroup;
  sessionLocationCode: string ;
  showTable = false;
  userType: any;
  currentDate: any;
  customerData: any;
  customerList: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Customer_Name', 'NoteDate', 'Particulars', 'Remark', 'Amount'];
  tempRateDetailForm: any;

  paymentEntryDataSource = new MatTableDataSource<any>([]);
  paymentEntryDisplayedColumns: string[] = [ 'Customer_Name', 'Bank_Name', 'CheqDt', 'RecvDt', 'Amount_Type', 'ChequeNo', 'Recv_Name', 'TDS', 'Amount', 'Debit', 'Remark', 'Deposit_Bank'];
  pageSizeOptions: number[] = [15, 50, 100, 1000];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  CreditNotesEdit: any;
  paymentEntryEdit: any;
  BankList: any;
  fromDate:any;
  toDate:any
  customerCode:any
  cashToPayData:any
  cashToPayReportFlag:boolean = false
  reportBranch: any;
  PaymentEntryData:any[]=[];

  rateDetails: any[] = [];

paymentModes = [
  { name: 'Cash' },
  { name: 'Online' },
  { name: 'Cheque' },
  { name: 'Credit' },
  { name: 'Debit Card' },
  { name: 'Credit Card' },
  { name: 'UPI' },
  { name: 'Bank Transfer' },
  { name: 'NEFT' },
  { name: 'RTGS' },
  { name: 'IMPS' },
  { name: 'Wallet' },
  { name: 'Demand Draft' },
  { name: 'Pay Order' },
  { name: 'Net Banking' },
  { name: 'Others' }
];


bankList = [
  { name: 'State Bank of India (SBI)' },
  { name: 'Punjab National Bank (PNB)' },
  { name: 'HDFC Bank' },
  { name: 'ICICI Bank' },
  { name: 'Axis Bank' },
  { name: 'Union Bank of India' },
  { name: 'Bank of Baroda' },
  { name: 'Canara Bank' },
  { name: 'Indian Bank' },
  { name: 'Central Bank of India' },
  { name: 'Bank of India' },
  { name: 'UCO Bank' },
  { name: 'Bank of Maharashtra' },
  { name: 'Indian Overseas Bank' },
  { name: 'IDBI Bank' },
  { name: 'Kotak Mahindra Bank' },
  { name: 'Yes Bank' },
  { name: 'IndusInd Bank' },
  { name: 'Federal Bank' },
  { name: 'South Indian Bank' },
  { name: 'Karur Vysya Bank' },
  { name: 'RBL Bank' },
  { name: 'DCB Bank' },
  { name: 'Bandhan Bank' },
  { name: 'AU Small Finance Bank' },
  { name: 'Jana Small Finance Bank' },
  { name: 'Equitas Small Finance Bank' },
  { name: 'IDFC FIRST Bank' },
  { name: 'Tamilnad Mercantile Bank' },
  { name: 'City Union Bank' },
  { name: 'Nainital Bank' },
  { name: 'Saraswat Co-operative Bank' },
  { name: 'Haryana Gramin Bank' },
  { name: 'Baroda UP Bank' },
  { name: 'Maharashtra Gramin Bank' },
  { name: 'North East Small Finance Bank' },
  { name: 'Capital Small Finance Bank' },
  { name: 'Utkarsh Small Finance Bank' },
  { name: 'ESAF Small Finance Bank' },
  { name: 'Unity Small Finance Bank' },
  { name: 'Fincare Small Finance Bank' },
  { name: 'Shivalik Small Finance Bank' },
  { name: 'Airtel Payments Bank' },
  { name: 'Paytm Payments Bank' },
  { name: 'India Post Payments Bank' },
  { name: 'FINO Payments Bank' }
];
  
 

  constructor(private _mdr: MatDialogRef<PaymentFormComponent>,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: {
                CreditNotesData: any;
                CreditNotesEdit: any;

                paymentEntryData: any;
                paymentEntryEdit: any;

                WalletEntryData: any;

                responseData:any;

                action: any;

                fromDate:any;
                toDate:any
                customerCode:any;
                CashPayReport:any;
                Branch:any;

              },
              public formBuilder: FormBuilder,
              private paymentService: PaymentService,
              public httpService: HttpService,
              public formbuilder: FormBuilder,
              public AllService: AllServicesService,
              public tripservice: TripService
            ) {
                if (data?.CreditNotesData) {
                  this.NoteNo = data.CreditNotesData.NoteNo;
                  this.CreditNotesEdit = data.CreditNotesEdit;
                }

                if (data?.paymentEntryData) {
                  this.Ref_Club = data.paymentEntryData.Ref_Club;
                  this.paymentEntryEdit = data.paymentEntryEdit;
                }

                if (data?.responseData) {
                  this.cashToPayData = data?.responseData;
                  this.fromDate = data?.fromDate;
                  this.toDate = data?.toDate;
                  this.customerCode = data?.customerCode;
                  this.cashToPayReportFlag= data?.CashPayReport;
                  this.reportBranch = data?.Branch
                  console.log("responseData>>>>>>",this.cashToPayData)
                }
  }

  ngOnInit(): void {
   this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');

    // this.AllService.getWalletConsigner(this.sessionLocationCode).subscribe((data: any) => {
    //   this.customerList = data.Data;
    // });

      this.AllService.getAllCustomer('Customer',this.sessionLocationCode).subscribe((data: any) => {
            this.customerList = data.Data;      
        });

    
     this.paymentService.getByBankName().subscribe((data: any) => {
      this.BankList = data.Data;
    });

     this.currentDate = new Date().toISOString().split('T')[0];

     this.creditNoteForm  = this.formbuilder.group({
      // noteNo: [''],
      Date: [this.currentDate, Validators.required],
      Customer: ['',Validators.required],
      Particulars: ['',Validators.required],
      Remark: [''],
      Amount: ['',Validators.required]
    });
    this.getCreditNoteByCustomerCode();

      this.paymentEntryForm = this.formbuilder.group({
      Customer: ['', Validators.required],
      BankName: ['', Validators.required],
      paymentType: [''],
      receiptNo: ['', Validators.required],
      receiptDt: [this.currentDate, Validators.required],
      receiveDt: [this.currentDate, Validators.required],
      receiverName: ['', Validators.required],
      Amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      TDS: [''],
      discount: [''],
      remark: [''],
      DepositeBank: [''],
    });

    this.paymentEntryBillForm = this.formbuilder.group({
      CustomerBill: ['', Validators.required],
      BankNameBill: ['', Validators.required],
      billAmt:['',Validators.required],
      paymentTypeBill: [''],
      receiptNoBill: ['', Validators.required],
      receiptDtBill: [this.currentDate, Validators.required],
      receiveDtBill: [this.currentDate, Validators.required],
      adjustAmount: ['', Validators.required],
      AmountBill: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      TDSBill: [''],
      outstandingAmt: [''],
      remarkBill: [''],
      DepositeBankBill: [''],
    });

    this.getPaymentEntryByCustomerCode();

    this.WalletEntryForm  = this.formbuilder.group({
      WalletDate: [this.currentDate, Validators.required],
      WalletCustomer: ['',Validators.required],
      WalletAmount: ['',Validators.required],
      paymentMode: ['',Validators.required],
      walletRemark: [''],
    });



    this.tempRateDetailForm = this.formbuilder.group({
      // SrNo: [null, Validators.required],
      paymentMode: ['', Validators.required],
      transactionID: ['', Validators.required],
      receivedBy: ['', Validators.required],
      depositedBank: ['', Validators.required],
      receivedDate: [this.currentDate, Validators.required],
      totalAmt: [this.cashToPayData?.PaymentOutstand, Validators.required],
      receivedAmt: [0, Validators.required],
      TDS: [0],
      debitNote: [0],
      outstandingAmt: [0],
      Remark: ['']
    });

    if(this.cashToPayReportFlag){
      this.getCashToPayReportData();
    }else if(!this.cashToPayReportFlag){
      this.getCashToPayData();
    }
       

}


  refresh() {

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

parseDateString(dateStr: string): string {
  if (!dateStr) { return ''; }
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}


addRateDetail() {
  if (this.tempRateDetailForm.invalid) return;

 const payload = {
        awbNo:this.cashToPayData?.AwbNo,
        paymentMode: this.tempRateDetailForm.get('paymentMode')?.value,
        transactionId: this.tempRateDetailForm.get('transactionID')?.value,  
        receivedBy: this.tempRateDetailForm.get('receivedBy')?.value,
        despositedBank: this.tempRateDetailForm.get('depositedBank')?.value, 
        receivedDate: this.tempRateDetailForm.get('receivedDate')?.value,
        totalAmt: this.tempRateDetailForm.get('totalAmt')?.value,
        receivedAmt: this.tempRateDetailForm.get('receivedAmt')?.value,
        tds: this.tempRateDetailForm.get('TDS')?.value,                      
        debitNote: this.tempRateDetailForm.get('debitNote')?.value,
        outstanding: this.tempRateDetailForm.get('outstandingAmt')?.value,   
        remark: this.tempRateDetailForm.get('Remark')?.value                   
    };

   this.paymentService.createCashToPay(payload)
    .subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');

          if (payload.outstanding == 0) {
            this.CloseDialog();
            return;  
          }

         this.getCashToPayData();
           
          this.tempRateDetailForm.reset({
          totalAmt: this.tempRateDetailForm.get('totalAmt')?.value || 0,
          receivedAmt: 0,
          TDS: 0,
          debitNote: 0,
          outstandingAmt: 0,
          Remark: ''
        });
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    });

  const newDetail = this.tempRateDetailForm.value;
      // const newDetail = {
      //   Payment_mode: this.tempRateDetailForm.value.paymentMode,
      //   TransactionId: this.tempRateDetailForm.value.transactionID,
      //   Received_by: this.tempRateDetailForm.value.receivedBy,
      //   Desposited_bank: this.tempRateDetailForm.value.depositedBank,
      //   Received_date: this.tempRateDetailForm.value.receivedDate,
      //   Total_amt: this.tempRateDetailForm.value.totalAmt,
      //   Received_amt: this.tempRateDetailForm.value.receivedAmt,
      //   TDS: this.tempRateDetailForm.value.TDS,
      //   Debit_note: this.tempRateDetailForm.value.debitNote,
      //   Outstanding: this.tempRateDetailForm.value.outstandingAmt,
      //   Remark: this.tempRateDetailForm.value.Remark,
      //   id: 1
      // };
    this.rateDetails.unshift(newDetail);
    // this.latestRecordTempId = 1;
}

latestRecordTempId: number | null = null;

getCashToPayData(){

   this.paymentService.getCashToPay(this.cashToPayData?.AwbNo, this.customerCode, this.fromDate, this.toDate, 1, 10)
    .subscribe((resp: any) => {
      // if (resp.status === 1) {
      //   this.openSnackBar(resp.message, 'custom-snackbar');

      //   this.rateDetails = (resp.getDetails || this.tempRateDetailForm.value).reverse();
      //   if (this.rateDetails.length > 0) {
      //     this.latestRecordTempId = this.rateDetails[0].id;
      //   }
      //   if (resp.getDetails?.length > 0) {
      //     const last = resp.getDetails[0];
      //     const remaining_total = last.Total_amt - (last.Received_amt + last.TDS + last.Debit_note);
      //     this.tempRateDetailForm.get('totalAmt')?.setValue(remaining_total);
      //   }
      // } else {
      //   this.openSnackBar(resp.message, 'error-snackbar');
      // }

       if (resp.status === 1) {
        
        if (resp.getDetails && resp.getDetails.length > 0) {

          this.rateDetails = resp.getDetails.reverse();
          this.latestRecordTempId = this.rateDetails[0].id;
          const last = resp.getDetails[0];
          const remaining = last.Total_amt - (last.Received_amt + last.TDS + last.Debit_note);
          this.tempRateDetailForm.get('totalAmt')?.setValue(remaining);
        }
        else {
          console.warn("API returned no data, keeping local rateDetails");
        }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }

    });
}
 

getCashToPayReportData(){
    this.paymentService.cashToPayReport(this.reportBranch,this.cashToPayData?.AwbNo,'','','', this.fromDate, this.toDate,1,100)
     .subscribe((resp: any) => {
      if (resp.status === 1) {
        
        if (resp.getDetails && resp.getDetails.length > 0) {

          this.rateDetails = resp.getDetails.reverse();
          this.latestRecordTempId = this.rateDetails[0].id;
          const last = resp.getDetails[0];
          const remaining = last.Total_amt - (last.Received_amt + last.TDS + last.Debit_note);
          this.tempRateDetailForm.get('totalAmt')?.setValue(remaining);
        }
        else {
          console.warn("API returned no data, keeping local rateDetails");
        }
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    });
}


calculateOutstandingAmt() {
  const totalAmt = Number(this.tempRateDetailForm.get('totalAmt')?.value) || 0;
  let receivedAmt = Number(this.tempRateDetailForm.get('receivedAmt')?.value) || 0;
  const tds = Number(this.tempRateDetailForm.get('TDS')?.value) || 0;
  const debitNote = Number(this.tempRateDetailForm.get('debitNote')?.value) || 0;

  const totalEntered = receivedAmt + tds + debitNote;

  if(totalEntered>totalAmt){
    const allowedReceived = totalAmt - (tds + debitNote);
    this.openSnackBar('Received amount cannot exceed Total Amount','error-snackbar');
    this.tempRateDetailForm.get('receivedAmt')?.setValue(allowedReceived > 0 ? allowedReceived : 0);
     receivedAmt = allowedReceived > 0 ? allowedReceived : 0;
  }

  const outstandingAmt = totalAmt - (receivedAmt + tds + debitNote);
  this.tempRateDetailForm.get('outstandingAmt')?.setValue(parseFloat(outstandingAmt.toFixed(2)));
}



getLatestRecordId(): number | null {
  if (!this.rateDetails || this.rateDetails.length === 0) return null;

  return Math.max(...this.rateDetails.map(d => d.id || 0));
}

removeRateDetail(index: number) {
  const detail = this.rateDetails[index];  

  if (!detail || !detail.id) {
    console.warn('No id found for this record.');
    return;
  }

  this.paymentService.deleteCashToPay(detail.id)
    .subscribe((resp: any) => {
      if (resp.status === 1) {
        this.openSnackBar(resp.message, 'custom-snackbar');
        this.rateDetails.splice(index, 1);
        this.getCashToPayData();
      } else {
        this.openSnackBar(resp.message, 'error-snackbar');
      }
    });
}



SubmitCreditNote() {
  if (this.creditNoteForm.invalid) {
    this.openSnackBar('Please fill all required fields.', 'error-snackbar');
    this.creditNoteForm.markAllAsTouched();
    return;
  }

  const formValue = this.creditNoteForm.value;

  const requestData = {
    // noteNo: formValue.noteNo,
    customerCode: formValue.Customer,
    particulars: formValue.Particulars,
    amount: parseFloat(formValue.Amount),
    noteDate: formValue.Date,
    remark: formValue.Remark,
    noteNo: this.NoteNo || ''
  };

  const apiMethod = this.CreditNotesEdit ? 'UpdateCreditNote' : 'CreateCreditNote';

  this.paymentService.CreditNote(apiMethod, requestData, '', '').subscribe({
    next: (res: any) => {
      if (res.status === 1) {
        this.dataSource.data = res.Data;
        this.openSnackBar(res.message, 'custom-snackbar');
        this.CloseDialog();
      } else {
        this.openSnackBar(res.message, 'error-snackbar');
      }
    },
    error: (err) => {
      this.openSnackBar('Error submitting Credit Note.', 'error-snackbar');
      console.error(err);
    },
  });
}

getCreditNoteByCustomerCode(): void {
    if (!this.NoteNo) { return; }
  this.paymentService
    .getByCreditNoteCode(this.NoteNo)
    .subscribe({
      next: (res: any) => {
        if (res.status === 1) {
        this.showTable = true;
        this.dataSource.data = res.Data;
          const creditNote = res.Data[0];
          this.creditNoteForm.patchValue({
            // noteNo: creditNote.NoteNo,
            Date: this.parseDateString(creditNote.NoteDate),
            Customer: creditNote.Customer_Code,
            Particulars: creditNote.Particulars,
            Remark: creditNote.Remark,
            Amount: creditNote.Amount
          });
      } else {
        this.showTable = false;
        this.openSnackBar(res.message, 'error-snackbar');
      }
      },
      error: () => {
        this.openSnackBar('Error fetching credit note data.', 'error-snackbar');
      }
    });
}


   submitPaymentEntry(): void {
    if (this.paymentEntryForm.invalid) {
      this.openSnackBar('Please fill all required fields.', 'error-snackbar');
      this.paymentEntryForm.markAllAsTouched();
      return;
    }

    // const newDetail = this.paymentEntryForm.value;
      // const newDetail = {
      //   Customer_Name: this.paymentEntryForm.value.Customer,
      //   Bank_Name: this.paymentEntryForm.value.BankName,
      //   CheqDt: this.paymentEntryForm.value.receiptDt,
      //   RecvDt: this.paymentEntryForm.value.receiveDt,
      //   Amount_Type: this.paymentEntryForm.value.paymentType,
      //   ChequeNo: this.paymentEntryForm.value.receiptNo,
      //   Recv_Name: this.paymentEntryForm.value.receiverName,
      //   TDS: this.paymentEntryForm.value.TDS,
      //   Amount: this.paymentEntryForm.value.Amount,
      //   Debit: this.paymentEntryForm.value.discount,
      //   Remark: this.paymentEntryForm.value.remark,
      //   Deposit_Bank: this.paymentEntryForm.value.DepositeBank,
      // };

      // const current = this.paymentEntryDataSource.data;
      // this.paymentEntryDataSource.data = [...current, newDetail];

    const formValue = this.paymentEntryForm.value;

    const payload = {
      customerCode: formValue.Customer,
      bankName: formValue.BankName,
      cheqDt: formValue.receiptDt,
      recvDt: formValue.receiveDt,
      amountType: formValue.paymentType,
      chequeNo: formValue.receiptNo,
      recvName: formValue.receiverName,
      tds: formValue.TDS,
      amount: formValue.Amount,
      debit: formValue.discount,
      remark: formValue.remark,
      depositBank: formValue.DepositeBank,
      userName: '',
      refClub: this.Ref_Club || ''
    };
    const apiMethod = this.paymentEntryEdit ? 'UpdateReceivedPay' : 'CreateReceivedPay';
    this.paymentService.receivedPayApi(apiMethod, payload, '', '').subscribe({
      next: (res: any) => {
        if (res.status === 1) {
          this.openSnackBar(res.message, 'custom-snackbar');
          // this.CloseDialog();
          this.paymentEntryForm.reset();
        } else {
          this.openSnackBar(res.message, 'error-snackbar');
        }
      },
      error: (err) => {
        this.openSnackBar('Error submitting Received Pay.', 'error-snackbar');
        console.error(err);
      }
    });
  }

getPaymentEntryByCustomerCode(): void {
    if (!this.Ref_Club) { return; }
  this.paymentService
    .getByReceivedPayCode(this.Ref_Club)
    .subscribe({
      next: (res: any) => {
        if (res.status === 1) {
          this.showTable = true;
          this.paymentEntryDataSource.data = res.Data;
          const paymentData = res.Data[0];

          this.paymentEntryForm.patchValue({
            Customer: paymentData.Customer_Code,
            BankName: paymentData.Bank_Name,
            paymentType: paymentData.Payment_Type,
            receiptNo: paymentData.ChequeNo,
            receiptDt: this.parseDateString(paymentData.CheqDt),
            receiveDt:  this.parseDateString(paymentData.RecvDt),
            receiverName: paymentData.Recv_Name,
            Amount: paymentData.Amount,
            TDS: paymentData.TDS,
            discount: paymentData.Debit,
            remark: paymentData.Remark,
            DepositeBank: paymentData.Deposit_Bank,
          });
          } else {
            this.showTable = false;
            this.openSnackBar(res.message, 'error-snackbar');
          }
      },
      error: () => {
        this.openSnackBar('Error fetching payment entry data.', 'error-snackbar');
      }
    });
}

paymentEntryData(pageNumber: number, pageSize: number) {
     this.paymentService.receivedPayNotes(pageNumber, pageSize).subscribe((resp: any) => {
       if (resp.status === 1) {
         this.showTable = true;
         this.paymentEntryDataSource.data = resp.Data;
        //  this.length = resp.count;
        //  this.calculatePageCount();
       } else {
          this.showTable = false;
        }
     });
  }


SubmitWalletEntry() {
  if (this.WalletEntryForm.invalid) {
    this.openSnackBar('Please fill all required fields.', 'error-snackbar');
    this.WalletEntryForm.markAllAsTouched();
    return;
  }

  const formValue = this.WalletEntryForm.value;

  const requestData = {
    inputName: 'CreateWallet',
    date: formValue.WalletDate,
    customerCode: formValue.WalletCustomer,
    amount: parseFloat(formValue.WalletAmount),
    paymentMode: formValue.paymentMode,
    remark: formValue.walletRemark
  };

  this.paymentService.createWallet(requestData).subscribe({
    next: (res: any) => {
      if (res.status === 1) {
        this.dataSource.data = res.Data;
        this.openSnackBar(res.message, 'custom-snackbar');
        this.CloseDialog();
      } else {
        this.openSnackBar(res.message, 'error-snackbar');
      }
    },
    error: (err) => {
      this.openSnackBar('Error submitting Credit Note.', 'error-snackbar');
      console.error(err);
    },
  });
}


CloseDialog() {
 this._mdr.close(false);
 }



}



// export class PaymentFormComponent implements OnInit {
//   NoteNo: any;
//   Ref_Club: any;
//   RateEdit: any;
//   creditNoteForm: FormGroup;
//   paymentEntryForm: FormGroup;
//   WalletEntryForm: FormGroup;
//   sessionLocationCode: string ;
//   showTable = false;
//   userType: any;
//   currentDate: any;
//   customerData: any;
//   customerList: any;
//   dataSource = new MatTableDataSource<any>();
//   displayedColumns: string[] = ['Customer_Name', 'NoteDate', 'Particulars', 'Remark', 'Amount'];
//   tempRateDetailForm: any;

//   paymentEntryDataSource = new MatTableDataSource<any>([]);
// paymentEntryDisplayedColumns: string[] = [ 'Customer_Name', 'Bank_Name', 'CheqDt', 'RecvDt', 'Amount_Type', 'ChequeNo', 'Recv_Name', 'TDS', 'Amount', 'Debit', 'Remark', 'Deposit_Bank'];
//  pageSizeOptions: number[] = [15, 50, 100, 1000];
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   CreditNotesEdit: any;
//   paymentEntryEdit: any;
//   BankList: any;

//   constructor(private _mdr: MatDialogRef<PaymentFormComponent>,
//               public dialog: MatDialog,
//               private snackBar: MatSnackBar,
//               @Inject(MAT_DIALOG_DATA) public data: {
//                 CreditNotesData: any;
//                 CreditNotesEdit: any;

//                 paymentEntryData: any;
//                 paymentEntryEdit: any;

//                 WalletEntryData: any;

//                 action: any;
//               },
//               public formBuilder: FormBuilder,
//               private paymentService: PaymentService,
//               public httpService: HttpService,
//               public formbuilder: FormBuilder,
//               public AllService: AllServicesService,
//               public tripservice: TripService
//             ) {
//                 if (data?.CreditNotesData) {
//                   this.NoteNo = data.CreditNotesData.NoteNo;
//                   this.CreditNotesEdit = data.CreditNotesEdit;
//                 }

//                 if (data?.paymentEntryData) {
//                   this.Ref_Club = data.paymentEntryData.Ref_Club;
//                   this.paymentEntryEdit = data.paymentEntryEdit;
//                 }
//   }

//   ngOnInit(): void {
//    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
//      ? localStorage.getItem('originCode')
//      : localStorage.getItem('selectedValue');
//     this.AllService.getWalletConsigner(this.sessionLocationCode).subscribe((data: any) => {
//       this.customerList = data.Data;
//     });
//      this.paymentService.getByBankName().subscribe((data: any) => {
//       this.BankList = data.Data;
//     });
//      this.currentDate = new Date().toISOString().split('T')[0];

//      this.creditNoteForm  = this.formbuilder.group({
//       // noteNo: [''],
//       Date: ['', Validators.required],
//       Customer: [''],
//       Particulars: [''],
//       Remark: [''],
//       Amount: ['']
//     });
//     this.getCreditNoteByCustomerCode();
//       this.paymentEntryForm = this.formbuilder.group({
//       Customer: ['', Validators.required],
//       BankName: ['', Validators.required],
//       paymentType: [''],
//       receiptNo: ['', Validators.required],
//       receiptDt: ['', Validators.required],
//       receiveDt: ['', Validators.required],
//       receiverName: ['', Validators.required],
//       Amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
//       TDS: [''],
//       discount: [''],
//       remark: [''],
//       DepositeBank: [''],
//     });
//     this.getPaymentEntryByCustomerCode();
//     this.WalletEntryForm  = this.formbuilder.group({
//       WalletDate: ['', Validators.required],
//       WalletCustomer: [''],
//       WalletAmount: [''],
//       paymentMode: [''],
//       walletRemark: [''],
//     });
//     this.tempRateDetailForm = this.formbuilder.group({
//   CheckRecvNo: ['', Validators.required],
//   BankRecvName: ['', Validators.required],
//   By: ['', Validators.required],
//   DepositBank: ['', Validators.required],
//   Date: ['', Validators.required],
//   RecvAmount: [0, Validators.required],
//   TDS: [0],
//   Debit: [0],
//   Narration: [''],
//   OSAmount: [0]
// });

//    }

//    refresh() {
//   }

//    getDefaultDate(): string {
//      const today = new Date();
//      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//      return this.formatDate(firstDayOfMonth);
//    }
//    formatDate(date: Date): string {
//      const year = date.getFullYear();
//      const month = date.getMonth() + 1;
//      const day = date.getDate();
//      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//    }

//    getCurrentDate(): string {
//      const today = new Date();
//      return this.formatDate(today);
//    }

//    openSnackBar(message: string, panelClass: string) {
//      this.snackBar.open(message, 'Close', {
//        duration: 3000,
//        horizontalPosition: 'right',
//        verticalPosition: 'top',
//        panelClass: [panelClass]
//      });
//    }

//    parseDateString(dateStr: string): string {
//   if (!dateStr) { return ''; }
//   const [day, month, year] = dateStr.split('-');
//   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
// }

// SubmitCreditNote() {
//   if (this.creditNoteForm.invalid) {
//     this.openSnackBar('Please fill all required fields.', 'error-snackbar');
//     this.creditNoteForm.markAllAsTouched();
//     return;
//   }

//   const formValue = this.creditNoteForm.value;

//   const requestData = {
//     // noteNo: formValue.noteNo,
//     customerCode: formValue.Customer,
//     particulars: formValue.Particulars,
//     amount: parseFloat(formValue.Amount),
//     noteDate: formValue.Date,
//     remark: formValue.Remark,
//     noteNo: this.NoteNo || ''
//   };

//   const apiMethod = this.CreditNotesEdit ? 'UpdateCreditNote' : 'CreateCreditNote';

//   this.paymentService.CreditNote(apiMethod, requestData, '', '').subscribe({
//     next: (res: any) => {
//       if (res.status === 1) {
//         this.dataSource.data = res.Data;
//         this.openSnackBar(res.message, 'custom-snackbar');
//         this.CloseDialog();
//       } else {
//         this.openSnackBar(res.message, 'error-snackbar');
//       }
//     },
//     error: (err) => {
//       this.openSnackBar('Error submitting Credit Note.', 'error-snackbar');
//       console.error(err);
//     },
//   });
// }

//   getCreditNoteByCustomerCode(): void {
//     if (!this.NoteNo) { return; }
//   this.paymentService
//     .getByCreditNoteCode(this.NoteNo)
//     .subscribe({
//       next: (res: any) => {
//         if (res.status === 1) {
//         this.showTable = true;
//         this.dataSource.data = res.Data;
//           const creditNote = res.Data[0];
//           this.creditNoteForm.patchValue({
//             // noteNo: creditNote.NoteNo,
//             Date: this.parseDateString(creditNote.NoteDate),
//             Customer: creditNote.Customer_Code,
//             Particulars: creditNote.Particulars,
//             Remark: creditNote.Remark,
//             Amount: creditNote.Amount
//           });
//       } else {
//         this.showTable = false;
//         this.openSnackBar(res.message, 'error-snackbar');
//       }
//       },
//       error: () => {
//         this.openSnackBar('Error fetching credit note data.', 'error-snackbar');
//       }
//     });
// }


//    submitPaymentEntry(): void {
//     if (this.paymentEntryForm.invalid) {
//       this.openSnackBar('Please fill all required fields.', 'error-snackbar');
//       this.paymentEntryForm.markAllAsTouched();
//       return;
//     }

//     const formValue = this.paymentEntryForm.value;

//     const payload = {
//       customerCode: formValue.Customer,
//       bankName: formValue.BankName,
//       cheqDt: formValue.receiptDt,
//       recvDt: formValue.receiveDt,
//       amountType: formValue.paymentType,
//       chequeNo: formValue.receiptNo,
//       recvName: formValue.receiverName,
//       tds: formValue.TDS,
//       amount: formValue.Amount,
//       debit: formValue.discount,
//       remark: formValue.remark,
//       depositBank: formValue.DepositeBank,
//       userName: '',
//       refClub: this.Ref_Club || ''
//     };
//     const apiMethod = this.paymentEntryEdit ? 'UpdateReceivedPay' : 'CreateReceivedPay';
//     this.paymentService.receivedPayApi(apiMethod, payload, '', '').subscribe({
//       next: (res: any) => {
//         if (res.status === 1) {
//           this.openSnackBar(res.message, 'custom-snackbar');
//           this.CloseDialog();
//         } else {
//           this.openSnackBar(res.message, 'error-snackbar');
//         }
//       },
//       error: (err) => {
//         this.openSnackBar('Error submitting Received Pay.', 'error-snackbar');
//         console.error(err);
//       }
//     });
//   }
//   getPaymentEntryByCustomerCode(): void {
//     if (!this.Ref_Club) { return; }
//   this.paymentService
//     .getByReceivedPayCode(this.Ref_Club)
//     .subscribe({
//       next: (res: any) => {
//         if (res.status === 1) {
//           this.showTable = true;
//           this.paymentEntryDataSource.data = res.Data;
//           const paymentData = res.Data[0];

//           this.paymentEntryForm.patchValue({
//             Customer: paymentData.Customer_Code,
//             BankName: paymentData.Bank_Name,
//             paymentType: paymentData.Payment_Type,
//             receiptNo: paymentData.ChequeNo,
//             receiptDt: this.parseDateString(paymentData.CheqDt),
//             receiveDt:  this.parseDateString(paymentData.RecvDt),
//             receiverName: paymentData.Recv_Name,
//             Amount: paymentData.Amount,
//             TDS: paymentData.TDS,
//             discount: paymentData.Debit,
//             remark: paymentData.Remark,
//             DepositeBank: paymentData.Deposit_Bank,
//           });
//           } else {
//             this.showTable = false;
//             this.openSnackBar(res.message, 'error-snackbar');
//           }
//       },
//       error: () => {
//         this.openSnackBar('Error fetching payment entry data.', 'error-snackbar');
//       }
//     });
// }


// SubmitWalletEntry() {
//   if (this.WalletEntryForm.invalid) {
//     this.openSnackBar('Please fill all required fields.', 'error-snackbar');
//     this.WalletEntryForm.markAllAsTouched();
//     return;
//   }

//   const formValue = this.WalletEntryForm.value;

//   const requestData = {
//     inputName: 'CreateWallet',
//     date: formValue.WalletDate,
//     customerCode: formValue.WalletCustomer,
//     amount: parseFloat(formValue.WalletAmount),
//     paymentMode: formValue.paymentMode,
//     remark: formValue.walletRemark
//   };

//   this.paymentService.createWallet(requestData).subscribe({
//     next: (res: any) => {
//       if (res.status === 1) {
//         this.dataSource.data = res.Data;
//         this.openSnackBar(res.message, 'custom-snackbar');
//         this.CloseDialog();
//       } else {
//         this.openSnackBar(res.message, 'error-snackbar');
//       }
//     },
//     error: (err) => {
//       this.openSnackBar('Error submitting Credit Note.', 'error-snackbar');
//       console.error(err);
//     },
//   });
// }



//   CloseDialog() {
// this._mdr.close(false);
// }
// }

