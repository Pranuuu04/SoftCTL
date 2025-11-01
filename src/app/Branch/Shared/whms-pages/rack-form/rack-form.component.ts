// import { Component, OnInit } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-rack-form',
  templateUrl: './rack-form.component.html',
  styleUrls: ['./rack-form.component.css']
})
export class RackFormComponent implements OnInit {

  validationMessage: any;
  rackForm: FormGroup;
  rackCode: any;
  rackName: any;

  constructor(private _mdr: MatDialogRef<RackFormComponent>,
    public formBuilder: FormBuilder,
    public httpService: HttpService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      if (this.data?.rackData) {
        this.rackCode = this.data.rackData.Rack_Code;
        this.rackName = this.data.rackData.Rack_Name;
        console.log('RackCode >>> ',this.rackCode)
        console.log('RackCode >>> ',this.rackCode)
      }
    }

  ngOnInit(): void {
      
    this.validationMessage = {
      rackCode: [ {type: 'required' , message: 'Please Enter Rack Code.'},{type: 'pattern' , message: 'Code should be alphanumeric.'} ],
      rackName: [ {type: 'required' , message: 'Please Enter Rack Name.'},{type: 'pattern' , message: 'Name should be alphanumeric.'} ],
    }
    
    this.rackForm = this.formBuilder.group({
      rackCode: new FormControl('', Validators.compose([ Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/)])),
      rackName: new FormControl('', Validators.compose([ Validators.required,Validators.pattern(/^[a-zA-Z0-9\s]+$/)])),
    });


  }

  formSubmitRack(formData: any){
    console.log('formdata:>>>', formData);
    this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Rack&operation=CreateRack&code=${formData.rackCode}&name=${formData.rackName}`).then((res: any) =>{
      console.log('formdata:', res.status);
      if (res.status == 1) {  
        this.openSnackBar(res.message , 'custom-snackbar' );
        this._mdr.close();
      } else {
        this.openSnackBar(res.message , 'custom-snackbar' );
        // alert(res.message)
      }
    });
  }

  updateRack(){
    this.httpService.get(`${environment.apiUrl}Master/allMasters?masterName=Rack&operation=UpdateRack&code=${this.rackCode}&name=${this.rackName}`).then((res: any) =>{
      console.log('formdata:', res.status);
      if (res.status == 1) {  
        this.openSnackBar(res.message , 'custom-snackbar' );
        this._mdr.close();
      } else {
        this.openSnackBar(res.message , 'custom-snackbar' );
        // alert(res.message)
      }
    });

  }

  openSnackBar(message: string, panelClass) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }


  CloseDialog(){
    this._mdr.close()
  }

}
