import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

  originCode: any;
  originName: any;
  username: any;
  labeChangesForm: FormGroup;
  label1Changes: any;
  label2Changes: any;
  label3Changes: any;
  label4Changes: any;
  label5Changes: any;
  label6Changes: any;
  label7Changes: any;
  label8Changes: any;
  label9Changes: any;
  label10Changes: any;
  label11Changes: any;
  label12Changes: any;
  label13Changes: any;
  label14Changes: any;
  label15Changes: any;
  inputFeild1: any;
  inputFeild2: any;
  inputFeild3: any;
  inputFeild4: any;
  inputFeild5: any;
  inputFeild6: any;
  inputFeild7: any;
  inputFeild8: any;
  inputFeild9: any;
  inputFeild10: any;
  inputFeild11: any;
  inputFeild12: any;

  constructor(public _mdr: MatDialogRef<LabelComponent>,
              public httpService: HttpService,
              public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // this.originCode = localStorage.getItem('originCode');
       this.originCode = localStorage.getItem('userType') !== 'Admin' ? localStorage.getItem('originCode') : localStorage.getItem('selectedValue');
    this.originName = localStorage.getItem('originName');
    this.username = localStorage.getItem('userName');
    this.getLabelData();
    this.labeChangesForm = this.formBuilder.group({
      inputFeild1: new FormControl('', Validators.compose([])),
      inputFeild2: new FormControl('', Validators.compose([])),
      inputFeild3 : new FormControl('', Validators.compose([])),
      inputFeild4: new FormControl('', Validators.compose([])),
      inputFeild5: new FormControl('', Validators.compose([])),
      inputFeild6: new FormControl('', Validators.compose([])),
      inputFeild7: new FormControl('', Validators.compose([])),
      inputFeild8: new FormControl('', Validators.compose([])),
      inputFeild9: new FormControl('', Validators.compose([])),
      inputFeild10: new FormControl('', Validators.compose([])),
      inputFeild11: new FormControl('', Validators.compose([])),
      inputFeild12: new FormControl('', Validators.compose([])),
      inputFeild13: new FormControl('', Validators.compose([])),
    })
  }

  getLabelData() {
    this.httpService.get(`${environment.apiUrl}Booking/getChargesName?sessionLocationCode=${this.originCode}`).then(resp => {
      console.log(resp, 'getlabel');
      this.label1Changes = resp.Data[0].Charges_1;
      this.label2Changes = resp.Data[0].Charges_2;
      this.label3Changes = resp.Data[0].Charges_3;
      this.label4Changes = resp.Data[0].Charges_4;
      this.label5Changes = resp.Data[0].Charges_5;
      this.label6Changes = resp.Data[0].Charges_6;
      this.label7Changes = resp.Data[0].Charges_7;
      this.label8Changes = resp.Data[0].Charges_8;
      this.label9Changes = resp.Data[0].Charges_9;
      this.label10Changes = resp.Data[0].Charges_10;
      this.label11Changes = resp.Data[0].othercharges;
      this.label12Changes = resp.Data[0].txt_label1;
      this.label13Changes = resp.Data[0].txt_label2;
      this.label14Changes = resp.Data[0].txt_label3;
      this.label15Changes = resp.Data[0].txt_label4;
    })
  }

  onClose(): void {
    this._mdr.close();
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  formSubmit(formData: any) {
    let obj  = {
      sessionLocationCode: this.originCode,
      txtlabel1: formData.inputFeild1 || this.label12Changes,
      txtlabel2: formData.inputFeild2 || this.label13Changes,
      txtlabel3: formData.inputFeild3  || this.label14Changes,
      txtlabel4: formData.inputFeild4 || this.label15Changes ,
      charges1: formData.inputFeild5 || this.label1Changes,
      charges2: formData.inputFeild6 || this.label2Changes,
      charges3: formData.inputFeild7 || this.label3Changes,
      charges4: formData.inputFeild8 || this.label4Changes,
      charges5: formData.inputFeild9 || this.label5Changes,
      charges6: formData.inputFeild10 || this.label6Changes,
      charges7: formData.inputFeild11 || this.label7Changes,
      charges8: formData.inputFeild12 || this.label8Changes,
      charges9: formData.inputFeild13 || this.label9Changes,
      charges10: 'charg10',
      otherCharges: 'EXTRA CHARGES',
    }
    console.log(obj, 'data');
    this.httpService.post(`${environment.apiUrl}Booking/chargesLabel`, obj).then(resp => {
      console.log(resp, 'postData');
      if (resp.status === 1) {
      this.openSnackBar(resp.message, 'custom-snackbar');
        this._mdr.close(obj);
      }
    })
  }

  CloseDialog() {
    this._mdr.close(false);
  }

}
