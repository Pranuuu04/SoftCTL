import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-performa-invoice',
  templateUrl: './performa-invoice.component.html',
  styleUrls: ['./performa-invoice.component.css']
})
export class PerformaInvoiceComponent implements OnInit, AfterViewInit {

  @ViewChild('PO_NO') PO_NO: ElementRef;

  PO_Date: any;
  Invoice_No: any;
  Inv_Value: any;
  Description: any;
  Qty: any;
  E_way_Bill_No: any;
  actualWeight: any;
  performaListData: any[] = [];
  totalInvoiceValue: any;
  performaForm: any;
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
  validationMessages: any;
  totalPerformaValue: any;
  Note: string;
  constructor(private _mdr: MatDialogRef<PerformaInvoiceComponent>,
              @Inject(MAT_DIALOG_DATA) data: any,
              public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              private renderer: Renderer2) {
                this.editMode = data.editMode
                if (data && data.performaListData) {
                  this.performaListData = Array.isArray(data?.performaListData) ? data.performaListData : [];
                  this.Note = data.performaListData[0].Note;
                } else {
                  this.performaListData = [];
                  this.Note = '';
                }
              }

  ngOnInit(): void {
    this.performaForm = this.formBuilder.group({
      invNo: new FormControl('', Validators.compose([Validators.required])),
      invDate: new FormControl('', Validators.compose([Validators.required])),
      Description: new FormControl('', Validators.compose([Validators.required])),
      HScode: new FormControl('', Validators.compose([])),
      unitType: new FormControl('', Validators.compose([])),
      Qty: new FormControl('', Validators.compose([Validators.required])),
      unitRate: new FormControl('', Validators.compose([Validators.required])),
      Amount: new FormControl('', Validators.compose([])),
    });

    this.performaForm.get('Qty')?.valueChanges.subscribe(() => this.calculateAmount());
    this.performaForm.get('unitRate')?.valueChanges.subscribe(() => this.calculateAmount());
    this.calculateTotalPerformaValue();

    this.validationMessage = {
        invNo: [{ type: 'required', message: 'Please select invNo'}],
        invDate: [{ type: 'required', message: 'Please select invDate'}],
        Description: [{ type: 'required', message: 'Please Enter Description'}],
        Qty: [{type: 'required', message: 'Please select Qty'}],
        unitRate: [{type: 'required', message: 'Please enter unitRate'}],
        Amount: [{type: 'required', message: 'Please select Amount'}],
      }
    }
    openSnackBar(message: string, panelClass: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }
    calculateAmount() {
      const qty = this.performaForm.get('Qty')?.value || 0;
      const unitRate = this.performaForm.get('unitRate')?.value || 0;
      const amount = qty * unitRate;
      this.performaForm.get('Amount')?.setValue(amount, { emitEvent: false });
    }
    calculateTotalPerformaValue() {
      this.totalPerformaValue = this.performaListData.reduce((sum, item) => sum + (item.Amount || 0), 0);
    }

  CloseDialog() {
    this._mdr.close();
  }

  ngAfterViewInit() {
  }

  saveData() {
    if (this.performaListData.length === 0) {
      this.openSnackBar( 'Cannot save empty Performa Invoice!', 'error-snackbar')
      return;
    }
    const updatedPerformaList = this.performaListData.map(item => ({
      ...item,
      Note: this.Note,
      Total: this.totalPerformaValue
    }));
    const obj = {
      data: updatedPerformaList,
      Total: this.totalPerformaValue,
      Note: this.Note
    }
    this._mdr.close(obj);
    if (this.editMode === true) {
      localStorage.setItem('updatedPerformaList', JSON.stringify(obj.data));
    }  }

  formSubmit(formData: any, form: NgForm) {
    if (this.performaForm.valid) {
      const obj = {
        InvoiceNo: formData.invNo,
        InvoiceDate: formData.invDate,
        Description: formData.Description,
        HSCode: formData.HScode,
        UnitType: formData.unitType,
        Qty: formData.Qty,
        UnitRate: formData.unitRate,
        Amount: formData.Amount,
        Note: this.Note,
        Total: this.totalPerformaValue
      };

       setTimeout(() => {
          this.performaListData.push({
            InvoiceNo: obj.InvoiceNo,
            InvoiceDate: obj.InvoiceDate,
            Description: obj.Description,
            HSCode: obj.HSCode,
            UnitType: obj.UnitType,
            Qty: obj.Qty,
            UnitRate: obj.UnitRate,
            Amount: obj.Amount,
          });
          this.calculateTotalPerformaValue();
        }, 500);
        setTimeout(() => {
          this.renderer.selectRootElement('#Description').focus();
        }, 600)
      form.controls['Description'].reset();
      form.controls['HScode'].reset();
      form.controls['unitType'].reset();
      form.controls['Qty'].reset();
      form.controls['unitRate'].reset();
      form.controls['Amount'].reset();
    } else {
      Object.keys(this.performaForm.controls).forEach((field) => {
        const control = this.performaForm.get(field);
        control.markAsTouched({ onlySelf: false });
      });
      // this.openSnackBar( 'fill All required feild', 'error-snackbar')
    }
  }

  deleteItem(index: number) {
    this.performaListData.splice(index, 1);
    this.calculateTotalPerformaValue();
  }

}
