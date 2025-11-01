import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceValComponent } from '../../invoiceVal/invoice-val.component';

@Component({
  selector: 'app-credit-invoice-val',
  templateUrl: './credit-invoice-val.component.html',
  styleUrls: ['./credit-invoice-val.component.scss']
})
export class CreditInvoiceValComponent implements OnInit {

  constructor(
    private _mdr: MatDialogRef<InvoiceValComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private formBuilder: FormBuilder

  ) { 
    
  }

  ngOnInit(): void {

  }
  CloseDialog() {
    this._mdr.close(false);
  }
  contact = {
    contacts: [{ invoiceno: '', invoiceval: '', remark:'' }]
  }

  form: FormGroup = this.formBuilder.group({
    // firstName: this.contact.firstName,
    // lastName: this.contact.lastName,
    contacts: this.buildContacts(this.contact.contacts)
  });


  get contacts(): FormArray {
    return this.form.get('contacts') as FormArray;
  }

  buildContacts(contacts: {invoiceno: string; invoiceval: string; remark: string;}[] = []) {
    return this.formBuilder.array(contacts.map(contact => this.formBuilder.group(contact)));
  }

  addContactField() {
    this.contacts.push(this.formBuilder.group({invoiceno: null, invoiceval: null, remark: null}))
  }

  removeContactField(index: number): void {
    if (this.contacts.length > 1) this.contacts.removeAt(index);
    else this.contacts.patchValue([{invoiceno: null, invoiceval: null, remark: null}]);
  }

  submit(value: any): void {
    console.log(value)
  }

  reset(): void {
    this.form.reset();
    this.contacts.clear();
    this.addContactField();
  }
}

