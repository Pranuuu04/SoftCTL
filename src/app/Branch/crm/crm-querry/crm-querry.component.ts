import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-crm-querry',
  templateUrl: './crm-querry.component.html',
  styleUrls: ['./crm-querry.component.css']
})
export class CrmQuerryComponent implements OnInit, AfterViewInit {

  awbNo: any;
  refNo: any;
  selectType= 'Awb';
  QuerryTableData1: any;
  QuerryTableData2: any;
  sales: any;
  forwording: any;
  inscan: any;
  Runsheet: any;
  Billing: any;
  actulaWeight: any;
  actulaWeight1: any;
  showTable = false;

  constructor(
              public httpService: HttpService,
              private snackBar: MatSnackBar,
              ) { }

  ngOnInit(): void {
  }
ngAfterViewInit() {
  const buttons = document.querySelectorAll('.accordion-card .btn');

  buttons.forEach((btn: any) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.accordion-card') as HTMLElement;
      const parent = document.getElementById('accordionExample');

      parent?.prepend(card);   // move clicked accordion to top
    });
  });
}

   openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  getQuerryTable1(){
    if(this.selectType === 'Awb'){
      if (!this.awbNo) {
        this.openSnackBar('Please enter AWB number.', 'error-snackbar')

        return;
      }
      this.httpService.get(`${environment.apiUrl}Crm/getquerydetails?awbno=${this.awbNo}&vendorawbno=`).then(resp=>{

        if(resp.status === 1){
        this.openSnackBar( resp.message, 'custom-snackbar')
        this.showTable = true;
        this.QuerryTableData1= resp.result[0]
        this.QuerryTableData2= resp.result[1]
        this.sales= resp.result[2][0]
        this.forwording= resp.result[3][0]
        this.inscan= resp.result[4][0]
        this.Runsheet= resp.result[5][0]
        this.Billing= resp.result[6][0]
        }else{
          this.openSnackBar(resp.message, 'error-snackbar')
        }
  
      }).catch ((error: any) => {
        console.error('Error fetching data from API', error);
        this.openSnackBar('Error fetching data from API', 'error-snackbar')
      });
    
    }else{
      if (!this.refNo) {
        this.openSnackBar('Please enter ref number.', 'error-snackbar')
        return;
      }
      this.httpService.get(`${environment.apiUrl}Crm/getquerydetails?awbno=&vendorawbno= ${this.refNo}` ).then(resp=>{
  
        if(resp.status === 1){
        this.openSnackBar( resp.message, 'custom-snackbar')
        this.showTable = true;
        this.QuerryTableData1= resp.result[0]
        this.QuerryTableData2= resp.result[1]
        this.sales= resp.result[2][0]
        this.forwording= resp.result[3][0]
        this.inscan= resp.result[4][0]
        this.Runsheet= resp.result[5][0]
        this.Billing= resp.result[6][0]
        }else{
          this.openSnackBar(resp.message, 'error-snackbar')
        }
  
      }).catch ((error: any) => {
        this.openSnackBar('Error fetching data from API', 'error-snackbar')
        console.error('Error fetching data from API', error);
      });
    }
  }
}
