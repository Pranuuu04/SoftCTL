import { HttpClient, HttpParameterCodec } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllServicesService } from 'app/service/all-services.service';

@Component({
  selector: 'app-consigner',
  templateUrl: './consigner.component.html',
  styleUrls: ['./consigner.component.scss']
})
export class ConsignerCreditComponent implements OnInit {
  deptForm :FormGroup
  getName: any;
  constructor(
    private _mdr: MatDialogRef<ConsignerCreditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb:FormBuilder,
    private http:HttpClient,
    private getData:AllServicesService
  ) { 
    this.deptForm = this.fb.group({
      ContactNumber: this.fb.control('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*[0-9]{10,10}')]),
 email : this.fb.control('',[Validators.required, Validators.email]),
 Departmentname:this.fb.control('')
})
   
       
      // ContactNumber : new FormControl(),
      this.getData.getDepartment().subscribe((res:any)=>{
        console.log("res",res.Data);
        this.getName=res.Data
        
        })
  }

  ngOnInit(): void {


  }
  CloseDialog() {
    this._mdr.close(false);
  }

  saveAllData(deptForm)
 {
  let send = this.deptForm.value
  this.getData.reciveDept(send)
  this._mdr.close(false);
  console.log("send",send);
  
 }

}

