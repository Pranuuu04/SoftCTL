import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-crm-complain',
  templateUrl: './crm-complain.component.html',
  styleUrls: ['./crm-complain.component.css']
})
export class CrmComplainComponent implements OnInit{

  currentDate: string;
  trackingTableData: any[] = [];
  trackingTableData2: any[] = [];
  complainTableData: any[] = []; 
  validationMessage: any = [];
   ComplainFORM: FormGroup;
  dataSource = new MatTableDataSource<any>(this.complainTableData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectType= 'Awb';
  awbNo: string;
  Complain:string;
  RefNo:string;
  showTable = false;
  showTable2 =false;
  
  constructor(
    public httpService: HttpService,
    private formbuilder: FormBuilder,
     private snackBar: MatSnackBar,
  ) {
  }
  displayedColumns: string[] = ['Date', 'AwbNo', 'RefNo', 'ComplainNo', 'Name', 'MobileNo', 'Type', 'Detail', 'Action', 'Status'];

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.validationMessage = {
      awbNo:[
        {type: 'required', message: 'Please select AwbNo'}
      ],
      Name: [
        {type: 'required', message: 'Please select Name.'}
      ],
      MobileNo: [
        {type: 'required', message: 'Please enter MobileNo'}
      ],
      Email: [
        {type: 'required', message: 'Please enter Email'}
      ],
      Type: [
        {type: 'required', message: 'Please enter Type'}
      ],
      Status: [
        {type: 'required', message: 'Please enter Status'}
      ],
      Detail: [
        {type: 'required', message: 'Please enter Detail'}
      ],
      Action: [
        {type: 'required', message: 'Please enter Action'}
      ]
    };

    this.ComplainFORM = this.formbuilder.group({
      awbNo: new FormControl('',Validators.compose([
        Validators.required
       ])),
      Name:  new FormControl('',Validators.compose([ ])),
      MobileNo: new FormControl('',Validators.compose([ ])),
      Email: new FormControl('',Validators.compose([ ])),
      Type: new FormControl('',Validators.compose([
         Validators.required
        ])),
        Status: new FormControl('',Validators.compose([
         Validators.required
        ])),
      Detail: new FormControl('',Validators.compose([
         Validators.required
        ])),
      Action: new FormControl('',Validators.compose([
         Validators.required
        ])),
    })
  }

  // checkAwbData(){
  //     if(this.selectType === 'Awb'){
  //       if (!this.awbNo) {
  //         alert("Please enter AWB number.");
  //         return;
  //       }
  //       this.httpService.get(`${environment.apiUrl}crm/CrmTrackk?awbno=${this.awbNo} &RefNo&ComplainNo`).then(resp=>{
  //         this.complainTableData= resp.Data[1]
  //         this.dataSource = new MatTableDataSource(this.complainTableData);
  //         this.dataSource.paginator = this.paginator;
  //         if(resp.status === 1){
  //           alert(resp.message);
  //           this.showTable = true;
  //           this.complainTableData = resp.Data[1];
  //           this.trackingTableData = resp.Data[0];
  //           this.trackingTableData2 = resp.Data[2];
  //           this.ComplainFORM.reset(); 
  //           this.awbNo = '';
  //         }else{
  //           alert("Invalid AWB number. Please check and try again.");
  //           this.showTable = false;
  //           this.complainTableData = [];
  //           this.trackingTableData = [];
  //           this.trackingTableData2 = [];
  //           this.awbNo = '';
  //         }
  //       });
  //     }else if(this.selectType === 'Complain'){
  //       if (!this.Complain) {
  //         alert("Please enter Complain number.");
  //         return;
  //       }
  //       this.httpService.get(`${environment.apiUrl}crm/CrmTrackk?awbno&RefNo&ComplainNo= ${this.Complain}`).then(resp=>{
  //         this.complainTableData= resp.Data[1]
  //         this.dataSource = new MatTableDataSource(this.complainTableData);
  //         this.dataSource.paginator = this.paginator;
  //         if(resp.status === 1){
  //           alert(resp.message);
  //           this.showTable = true;
  //           this.complainTableData = resp.Data[1];
  //           this.trackingTableData = resp.Data[0];
  //           this.trackingTableData2 = resp.Data[2];
  //           this.ComplainFORM.reset(); 
  //           this.awbNo = '';
  //         }else{
  //           alert("Invalid Complain number. Please check and try again.");
  //           this.showTable = false;
  //           this.complainTableData = [];
  //           this.trackingTableData = [];
  //           this.trackingTableData2 = [];
  //           this.awbNo = '';
  //         }
  //       });
  //     }else{
  //       if (!this.RefNo) {
  //         alert("Please enter Reference number.");
  //         return;
  //       }
  //       this.httpService.get(`${environment.apiUrl}crm/CrmTrackk?awbno&RefNo=${ this.RefNo} &ComplainNo`).then(resp=>{
  //         this.complainTableData= resp.Data[1]
  //         this.dataSource = new MatTableDataSource(this.complainTableData);
  //         this.dataSource.paginator = this.paginator;
  //         if(resp.status === 1){
  //           alert(resp.message);
  //           this.showTable = true;
  //           this.complainTableData = resp.Data[1];
  //           this.trackingTableData = resp.Data[0];
  //           this.trackingTableData2 = resp.Data[2];
  //           this.ComplainFORM.reset(); 
  //           this.awbNo = '';
  //         }else{
  //           alert("Invalid Refrance number. Please check and try again.");
  //           this.showTable = false;
  //           this.complainTableData = [];
  //           this.trackingTableData = [];
  //           this.trackingTableData2 = [];
  //           this.awbNo = '';
  //         }
  //       });
  //     }
  // }
    openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  async checkAwbData() {
    try {
      if (this.selectType === 'Awb') {
        if (!this.awbNo) {
          this.openSnackBar('Please enter AWB number.', 'error-snackbar')
          return;
        }
  
        const resp = await this.httpService.get(`${environment.apiUrl}crm/CrmTrackk?awbno=${this.awbNo}&RefNo&ComplainNo`);
  
        this.handleResponse(resp);
      } else if (this.selectType === 'Complain') {
        if (!this.Complain) {
          this.openSnackBar('Please enter Complain number.', 'error-snackbar')
          return;
        }
  
        const resp = await this.httpService.get(`${environment.apiUrl}crm/CrmTrackk?awbno&RefNo&ComplainNo=${this.Complain}`);
  
        this.handleResponse(resp);
      } else {
        if (!this.RefNo) {
          this.openSnackBar('Please enter Reference number.', 'error-snackbar')
          return;
        }
  
        const resp = await this.httpService.get(`${environment.apiUrl}crm/CrmTrackk?awbno&RefNo=${this.RefNo}&ComplainNo`);
  
        this.handleResponse(resp);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      this.openSnackBar('Please entere valid number.', 'error-snackbar')
    }
  }
  
  handleResponse(resp) {
    this.complainTableData = resp.Data[1];
    this.dataSource = new MatTableDataSource(this.complainTableData);
    this.dataSource.paginator = this.paginator;
  
    if (resp.status === 1) {
      this.openSnackBar( resp.message, 'custom-snackbar')
      this.showTable = true;
      this.showTable2 = true;
      this.trackingTableData = resp.Data[0];
      this.trackingTableData2 = resp.Data[2];
      this.ComplainFORM.reset();
    } else {
      this.openSnackBar(`Invalid ${this.selectType} number. Please check and try again.`, 'error-snackbar')
      this.showTable = false;
      this.showTable2 = false;
      this.complainTableData = [];
      this.trackingTableData = [];
      this.trackingTableData2 = [];
      this.awbNo = '';
    }
  }
  
formSubmit(formData: any){
  if (
    !this.awbNo||
    !this.ComplainFORM.value.Type||
    !this.ComplainFORM.value.Status||
    !this.ComplainFORM.value.Detail||
    !this.ComplainFORM.value.Action
  ) {
    this.openSnackBar('Please fill in all required fields.', 'error-snackbar')
    return;
  }
      let obj = {
        AwbNo:this.awbNo,
        Date: this.currentDate,
        Name: formData.Name,
        MobileNo: formData.MobileNo,
        Email: formData.Email,
        Type: formData.Type,
        Status: formData.Status,
        Detail: formData.Detail,
        Action: formData.Action,
      }
      this.httpService.post(`${environment.apiUrl}Crm/GetComplain`,obj).then(resp=>{
        if(resp.status === 1){
          this.openSnackBar( resp.msg, 'custom-snackbar')
          this.showTable = true;
          this.showTable2 = true;
          this.ComplainFORM.reset();
          this.complainTableData = [];
          this.trackingTableData = [];
          this.trackingTableData2 = [];
          this.awbNo = ''; 
        }
        else{
          this.openSnackBar(resp.msg, 'error-snackbar')
        }
      }) 
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}