import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-viewadd',
  templateUrl: './viewadd.component.html',
  styleUrls: ['./viewadd.component.css']
})
export class ViewaddComponent implements OnInit {
 
  manifestEditData: any;
  manifestNo: any;
  createForm: any;
  ToDstCode: any;
  fromDestCode: any;

  constructor(public formBuilder: FormBuilder,
              public httpService: HttpService,
              private snackBar :MatSnackBar,
              private _mdr :MatDialogRef <ViewaddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
        // this.fromDestCode = localStorage.getItem('fromDestCode');
        

    if (data.responseData) {
      this.manifestEditData = data.responseData,
      this.manifestNo = data.responseData.manifestNo,
      this.fromDestCode = data.responseData.fromDestCode
      console.log( "fromDestination" , this.fromDestCode);
      }
    this.ToDstCode = data.ToDstCode;
   }

  ngOnInit(): void {
    this.saveButtonClicked();
    this.createForm = this.formBuilder.group({
      manifestNo: [this.manifestNo],
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
        manifestNo: this.manifestNo ,
      };
      const apiUrl = `${environment.apiUrl}Manifest/addManifest?manifestNo=${object.manifestNo}&fromDest=${this.fromDestCode}&awbNo=${object.awbNo}`;
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
  
