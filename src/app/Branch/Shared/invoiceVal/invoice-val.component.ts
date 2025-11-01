import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '../../../service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-invoice-val',
  templateUrl: './invoice-val.component.html',
  styleUrls: ['./invoice-val.component.scss']
})
export class InvoiceValComponent implements OnInit, AfterViewInit {

  @ViewChild('PO_NO') PO_NO: ElementRef;

  PO_Date: any;
  Invoice_No: any;
  Inv_Value: any;
  Description: any;
  Qty: any;
  E_way_Bill_No: any;
  actualWeight: any;
  invoiceListData: any[] = [];
  totalInvoiceValue: any;
  vendorForm: any;
  validationMessage: any = [];
  ewayBillList: any = [];
  ewayBillNumbers: any;
  invoiceNoList: any = [];
  invoiceNumbers: any;
  custInvoice: any = [];
  enabledEwayBillNo: any;
  currentDate: any;
  custInvoiceData: any;
  editMode: any;

  validationMessages: any = {
    PO_NO: [{ type: 'required', message: 'Please select Origin' }],
    PO_Date: [{ type: 'required', message: 'Please select destination' }],
    Invoice_No: [{ type: 'required', message: 'Please Enter Invoice No' }],
    Inv_Value: [{ type: 'required', message: 'Please select Invoice Value' }],
    Description: [{ type: 'required', message: 'Please enter Description' }],
    Qty: [{ type: 'required', message: 'Please enter Qty' }],
    E_way_Bill_No: [{ type: 'required', message: 'Please enter E_way Bill' }],
  };

  setEWayBillValidators() {
    // this.totalInvoiceValue = localStorage.getItem('totalInvoiceValue');
    const invValue = this.vendorForm.get('Inv_Value').value;
    const eWayBillControl = this.vendorForm.get('E_way_Bill_No');
    if (invValue > 50000) {
      eWayBillControl.setValidators([Validators.required]);
    } else {
      eWayBillControl.clearValidators();
    }
    eWayBillControl.updateValueAndValidity();
  }

  constructor(private _mdr: MatDialogRef<InvoiceValComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private _snackBar: MatSnackBar,
              private renderer: Renderer2) {
                if (data) {
                  this.editMode = data.editMode,
                  this.custInvoice = data.CustInvoiceData || [];
                  this.currentDate = new Date().toISOString().split('T')[0];
                  this.totalInvoiceValue = data.invoiceValue || 0;
                  // this.invoiceListData = this.custInvoice || [];
                } else {
                  this.invoiceListData = [];
                }
                // this.invoiceListData = localStorage.getItem('invoiceListData');
                // this.invoiceListData = this.invoiceListData ? JSON.parse(this.invoiceListData) : [];
                // this.custInvoice = localStorage.getItem('custInvoice');
                // this.custInvoice = this.custInvoice ? JSON.parse(this.custInvoice) : [];
                // this.ewayBillNumbers = localStorage.getItem('ewayBillNumbers');
                // console.log(this.ewayBillNumbers, 'this.ewayBillNumbers');

                // this.invoiceNumbers = localStorage.getItem('invoiceNumbers');
                // console.log(this.invoiceNumbers, 'this.invoiceNumbers');
              }

  ngOnInit(): void {
    this.vendorForm = this.formBuilder.group({
      PO_NO: new FormControl('', Validators.compose([])),
      PO_Date: new FormControl('', Validators.compose([])),
      Invoice_No: new FormControl('', Validators.compose([Validators.required])),
      Inv_Value: new FormControl('', Validators.compose([Validators.required])),
      Description: new FormControl('', Validators.compose([])),
      Qty: new FormControl('', Validators.compose([Validators.required])),
      E_way_Bill_No: new FormControl('', Validators.compose([])),
    });
    // this.calculateTotalInvoiceValue();
    // this.totalInvoiceValue = localStorage.getItem('totalInvoiceValue');
    // const value = JSON.parse(localStorage.getItem('invoiceListData'));
    // if (value != null || undefined) {
    //   this.invoiceListData = value;
    // } else {
    //   this.invoiceListData = this.custInvoice;
    // }
    const value = JSON.parse(localStorage.getItem('invoiceListData') || 'null');
    if (Array.isArray(value)) {
      this.invoiceListData = value;
    } else if (Array.isArray(this.custInvoice)) {
      this.invoiceListData = this.custInvoice;
    } else {
      this.invoiceListData = [];
    }
    this.vendorForm.get('Inv_Value').valueChanges.subscribe(() => {
      this.setEWayBillValidators();
    });

    this.setEWayBillValidators();

    this.validationMessage = {
        PO_NO: [{ type: 'required', message: 'Please select Origin'}],
        PO_Date: [{ type: 'required', message: 'Please select destination'}],
        Invoice_No: [{ type: 'required', message: 'Please Enter Invoice No'}],
        Inv_Value: [{ type: 'required', message: 'Please select Drivername'}],
        Description: [{ type: 'required', message: 'Please select Coloadername'}],
        Qty: [{type: 'required', message: 'Please select Quantity'}],
        E_way_Bill_No: [{type: 'required', message: 'Please enter E_way Bill'}],
      }
    }

    private focusOnPoNoInput() {
      if (this.PO_NO && this.PO_NO.nativeElement) {
        this.PO_NO.nativeElement.focus();
      }
    }

  CloseDialog() {
    this._mdr.close();
  }

  ngAfterViewInit() {
    this.focusOnPoNoInput();
  }

  saveData() {
    // this.calculateTotalInvoiceValue();
    this.ewayBillNumbers = this.invoiceListData
    .map(item => item.ewayBillNo)
    .filter(Boolean)
    .join(',');

  this.invoiceNumbers = this.invoiceListData
    .map(item => item.InvoiceNo)
    .join(',');

    const obj = {
      data: this.invoiceListData || this.custInvoice,
      total: this.totalInvoiceValue,
      ewayBillData: this.ewayBillNumbers,
      invoiceData: this.invoiceNumbers
    }
    this._mdr.close(obj);
    localStorage.setItem('invoiceListData', JSON.stringify(obj.data));
    // localStorage.setItem('custInvoice', JSON.stringify(obj.data));
    // localStorage.setItem('ewayBillList', JSON.stringify(obj.data));
    // localStorage.setItem('invoiceNoList', JSON.stringify(obj.data));
    // localStorage.setItem('totalInvoiceValue', this.totalInvoiceValue);
    // localStorage.setItem('ewayBillNumbers', this.ewayBillNumbers);
    localStorage.setItem('invoiceNumbers', this.invoiceNumbers);
  }
    // if (this.editMode === true) {
    //   if (this.custInvoice && this.custInvoice.length > 0) {
    //     this.invoiceListData = [...this.custInvoice, ...this.invoiceListData];
    //   }
    // }
  formSubmit(formData: any, form: NgForm) {
    if (this.vendorForm.valid) {
      if (formData.Inv_Value > 50000 && !formData.E_way_Bill_No) {
        alert('Inv_Value is greater than 50000, and E_way_Bill_No cannot be empty. Data cannot be added.');
        return;
      }
      const obj = {
        poNo: formData.PO_NO,
        poDate: formData.PO_Date,
        InvoiceNo: formData.Invoice_No,
        InvoiceValue: formData.Inv_Value,
        description: formData.Description,
        qty: formData.Qty,
        ewayBillNo: formData.E_way_Bill_No
      };

      if (this.custInvoice === null) {
        setTimeout(() => {
          this.invoiceListData.push({
            poNo: obj.poNo,
            poDate: obj.poDate,
            InvoiceNo: obj.InvoiceNo,
            description: obj.description,
            qty: obj.qty,
            InvoiceValue: obj.InvoiceValue,
            ewayBillNo: obj.ewayBillNo,
          });
          if (obj.ewayBillNo) {
            this.invoiceListData.map((item: any) => {
                this.ewayBillList.push({
                  ewayBillNo: item.ewayBillNo,
              });
            })
          }
          this.invoiceListData.map((item: any) => {
            this.invoiceNoList.push({
              InvoiceNo: item.InvoiceNo,
            });
          })
          this.calculateTotalInvoiceValue();
          this.ewayBillNumbers = this.invoiceListData.map(item => item.ewayBillNo).filter(Boolean).join(',');
          this.invoiceNumbers = this.invoiceListData.map(item => item.InvoiceNo).join(',');
        }, 500);
        setTimeout(() => {
          this.renderer.selectRootElement('#poNo').focus();
        }, 600)
      } else if (this.editMode === true) {
        setTimeout(() => {
          // this.invoiceListData = this.invoiceListData || []; // Ensure it's not null
          this.invoiceListData.push({
            poNo: obj.poNo,
            poDate: obj.poDate,
            InvoiceNo: obj.InvoiceNo,
            description: obj.description,
            qty: obj.qty,
            InvoiceValue: obj.InvoiceValue,
            ewayBillNo: obj.ewayBillNo,
          });
          if (obj.ewayBillNo) {
            this.ewayBillList.push({ ewayBillNo: obj.ewayBillNo });
          }

          this.invoiceNoList.push({ InvoiceNo: obj.InvoiceNo });

          this.calculateTotalInvoiceValue();
          this.ewayBillNumbers = this.invoiceListData
          .map(item => item.ewayBillNo)
          .filter(Boolean)
          .join(',');
        this.invoiceNumbers = this.invoiceListData
          .map(item => item.InvoiceNo)
          .join(',');
        }, 500);
        setTimeout(() => {
          this.renderer.selectRootElement('#poNo').focus();
        }, 600)
      } else {
        setTimeout(() => {
          this.invoiceListData.push({
            poNo: obj.poNo,
            poDate: obj.poDate,
            InvoiceNo: obj.InvoiceNo,
            description: obj.description,
            qty: obj.qty,
            InvoiceValue: obj.InvoiceValue,
            ewayBillNo: obj.ewayBillNo,
          });
          if (obj.ewayBillNo) {
            this.invoiceListData.map((item: any) => {
                this.ewayBillList.push({
                  ewayBillNo: item.ewayBillNo,
              });
            })
          }
          this.invoiceListData.map((item: any) => {
            this.invoiceNoList.push({
              InvoiceNo: item.InvoiceNo,
            });
          })
          this.calculateTotalInvoiceValue();
          this.ewayBillNumbers = this.invoiceListData.map(item => item.ewayBillNo).filter(Boolean).join(',');
          this.invoiceNumbers = this.invoiceListData.map(item => item.InvoiceNo).join(',');
        }, 500);
        setTimeout(() => {
          this.renderer.selectRootElement('#length').focus();
        }, 600)
      }
      form.controls['PO_NO'].reset();
      form.controls['PO_Date'].reset();
      form.controls['Invoice_No'].reset();
      form.controls['Description'].reset();
      form.controls['Qty'].reset();
      form.controls['Inv_Value'].reset();
      form.controls['E_way_Bill_No'].reset();
    } else {
      Object.keys(this.vendorForm.controls).forEach((field) => {
        const control = this.vendorForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
      alert('Inv_Value is greater than 50,000, and E_way_Bill_No cannot be empty. Data cannot be added.')
    }
  }

  calculateTotalInvoiceValue() {
    this.totalInvoiceValue = 0;
   if ( this.custInvoice === null) {
    this.invoiceListData.forEach(item => {
      const InvoiceValue = parseFloat(item.InvoiceValue || '0');
      this.totalInvoiceValue += InvoiceValue;
    });
   } else if ( this.editMode === true) {
    this.invoiceListData.forEach(item => {
      const InvoiceValue = parseFloat(item.InvoiceValue || '0');
      this.totalInvoiceValue += InvoiceValue;
    });
   } else {
    this.invoiceListData.forEach(item => {
      console.log(item, 'hello item');
      const InvoiceValue = parseFloat(item.InvoiceValue || '0');
      this.totalInvoiceValue += InvoiceValue;
    });
   }
  }

  calculateTotalInvoiceNo() {
    // this.invoiceNumbers = '';
    this.invoiceNumbers = this.invoiceListData
    .map(item => item.InvoiceNo)
    .join(',');
    if (this.custInvoice === null) {
      this.invoiceListData.forEach(item => {
        const InvoiceNo = item.InvoiceNo.toString();
        console.log(InvoiceNo, 'hello InvoiceValue');
        this.invoiceNumbers += InvoiceNo;
        console.log(this.invoiceNumbers, 'this.invoiceNumbers');
      });
    } else  if (this.editMode === true) {
      this.invoiceListData.forEach(item => {
        const InvoiceNo = item.InvoiceNo.toString();
        this.invoiceNumbers += InvoiceNo;
      });
    } else {
      this.custInvoice.forEach(item => {
        const InvoiceNo = item.InvoiceNo.toString();
        this.invoiceNumbers += InvoiceNo;
      });
    }
  }

  calculateTotalEwayBillNo() {
    // this.ewayBillNumbers = '';
    this.ewayBillNumbers = this.invoiceListData
    .map(item => item.ewayBillNo)
    .filter(Boolean)
    .join(',');
    if (this.custInvoice === null) {
      this.invoiceListData.forEach(item => {
        const ewayBillNo = item.ewayBillNo.toString();
        this.ewayBillNumbers += ewayBillNo;
      });
    } else if (this.editMode === true) {
      this.invoiceListData.forEach(item => {
        const ewayBillNo = item.ewayBillNo.toString();
        this.ewayBillNumbers += ewayBillNo;
      });
    } else {
      this.custInvoice.forEach(item => {
        const ewayBillNo = item.ewayBillNo.toString();
        this.ewayBillNumbers += ewayBillNo;
      });
    }
  }
  // deleteItem(index: number) {
  //   if (this.custInvoice === null || !this.editMode) {
  //     this.invoiceListData.splice(index, 1);
  //   } else {
  //     this.custInvoice.splice(index, 1);
  //   }

  //   // Recalculate strings after deletion
  //   this.calculateTotalEwayBillNo();
  //   this.calculateTotalInvoiceNo();
  //   this.calculateTotalInvoiceValue();
  // }
  deleteItem(index: any) {
    this.invoiceListData.splice(index, 1);
    localStorage.setItem('invoiceListData', JSON.stringify(this.invoiceListData));
    this.calculateTotalEwayBillNo();
    this.calculateTotalInvoiceNo();
    this.calculateTotalInvoiceValue();
  }
  // deleteItem(index: any) {
  //   if (this.custInvoice === null) {
  //     this.invoiceListData.splice(index, 1);
  //     this.calculateTotalEwayBillNo();
  //     this.calculateTotalInvoiceNo();
  //     this.calculateTotalInvoiceValue();
  //   }  else if (this.editMode === true) {
  //     this.invoiceListData.splice(index, 1);
  //     this.calculateTotalEwayBillNo();
  //     this.calculateTotalInvoiceNo();
  //     this.calculateTotalInvoiceValue();
  //   } else {
  //     this.custInvoice.splice(index, 1);
  //     this.calculateTotalEwayBillNo();
  //     this.calculateTotalInvoiceNo();
  //     this.calculateTotalInvoiceValue();
  //   }
  // }

}
