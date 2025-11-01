import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VolumetricComponent } from '../../volumetric/volumetric.component';

@Component({
  selector: 'app-credit-volumetric',
  templateUrl: './credit-volumetric.component.html',
  styleUrls: ['./credit-volumetric.component.scss']
})
export class CreditVolumetricComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private _mdr: MatDialogRef<VolumetricComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
    ) {}


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



