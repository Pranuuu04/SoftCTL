import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-add-drs',
  templateUrl: './add-drs.component.html',
  styleUrls: ['./add-drs.component.css']
})
export class AddDrsComponent implements OnInit {

  CreateForm: any;
  // sessionLocationCode: any;
  DrsNoEditData: any;
  DrsNo: any;
  parentComponent: any ;
  @Output() dataUpdated: EventEmitter<any> = new EventEmitter<any>();
  Location: any;

  constructor( private _mdr: MatDialogRef<AddDrsComponent>,
               public dialog: MatDialog,
               public formBuilder: FormBuilder,
               private http: HttpService,
               private cdr: ChangeDetectorRef,
               private snackBar: MatSnackBar,
               @Inject(MAT_DIALOG_DATA) public data: any) {
                 if (data.DrsData) {
                    this.DrsNo = data.DrsData.DrsNO;
                    this.Location = data.DrsData.Location ;
                    console.log( "Location : " , this.Location);
                  }
                  if (data.parentComponent) {
                    this.parentComponent = data.parentComponent;
                  }
                }

  ngOnInit(): void {
    // this.sessionLocationCode = localStorage.getItem('originCode');
        this.CreateForm = this.formBuilder.group({
      DrsNo: [this.DrsNo],
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

  CloseDialog() {
    this._mdr.close(false);
  }
  
  formSubmit(formData: any){
    const awbNoValue = formData.awbNo;
    if (!awbNoValue) {
      this.openSnackBar( 'AWB field is empty. Please enter a value.' , 'error-snackbar');
      return; 
    }
      this.http.get(`${environment.apiUrl}runsheet/addRunsheet?sessionLocationCode=${this.Location}&drsNo=${this.DrsNo}&awbNo=${formData.awbNo}`).then(resp =>{
        if(resp.status === 1){
          this.openSnackBar( resp.message, 'custom-snackbar');
          this._mdr.close({ success: true, data: formData });
          this.dataUpdated.emit(formData);
          this.cdr.detectChanges();
        }else{ 
          this.openSnackBar( resp.message, 'error-snackbar');
        }      
    })
  }

}