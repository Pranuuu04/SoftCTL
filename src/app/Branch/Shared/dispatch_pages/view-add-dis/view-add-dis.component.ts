import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-add-dis',
  templateUrl: './view-add-dis.component.html',
  styleUrls: ['./view-add-dis.component.css']
})
export class ViewAddDisComponent implements OnInit {
  DispatchEditData: any;
  DispatchNo: any;
  createForm: any;
  ToDstCode: any;
  sessionLocationCode: any;
  Location: any;

  constructor(public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar :MatSnackBar,
              private _mdr :MatDialogRef <ViewAddDisComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
        this.sessionLocationCode = localStorage.getItem('originCode');

    if (data.responseData) {
      this.DispatchEditData = data.responseData,
      this.DispatchNo = data.responseData.dispatchNo;
      this.Location = data.responseData.FromDestCode ;
      }
    this.ToDstCode = data.ToDstCode;
   }

  ngOnInit(): void {
    this.saveButtonClicked();
    this.createForm = this.formBuilder.group({
      DispatchNo: [this.DispatchNo],
      awbNo: [''],})
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
  closeForm() {
    this._mdr.close(false);
  }
  saveButtonClicked(): void {
    }

    formSubmit(formData: any) {
      let object = {
        awbNo: formData.awbNo,
        DispatchNo: this.DispatchNo ,
      };
      const apiUrl = `${environment.apiUrl}dispatch/addDispachByAwbNo?sessionLocationCode=${this.Location}&dispatchNo=${object.DispatchNo}&awbNo=${object.awbNo}`;
      this.httpService.get(apiUrl).then((resp) => {
        if(resp.status === 1){
          this.openSnackBar( resp.message, 'custom-snackbar');
          this.closeForm();
        }else{ 
          this.openSnackBar( resp.message, 'error-snackbar');
        }       
      });
    }
    
}
