import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-tack-details',
  templateUrl: './tack-details.component.html',
  styleUrls: ['./tack-details.component.css']
})
export class TackDetailsComponent implements OnInit {

  awbNo: any;
  refNo: any;
  selectType = 'Awb';
  QuerryTableData: any;
  QuerryTableData2: any;
  showTable = false;
  QuerryTableDataArray: any[] = [];
  originName: string;
  PODimg: string;

  constructor(private route: ActivatedRoute,
              public httpService: HttpService,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
      this.originName = localStorage.getItem('originName');

    this.route.params.subscribe((params) => {
      console.log("Url PARAMS", params);
      if (params.value !== null && params.value !== "") {
        if (params.type === 'Ref') {
          this.selectType = 'Ref';
          this.refNo = params.value;
          console.log(this.refNo, "refranceNo");
        } else {
          this.selectType = 'Awb';
          this.awbNo = params.value;
          console.log(this.awbNo, "awbNo");
        }
        this.getQuerryTable();
      }
    });
  }
// new
openSnackBar(message: string, panelClass: string) {
  this.snackBar.open(message, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: [panelClass]
  });
}

getQuerryTable() {
  const payload: any = {};
  if (this.selectType === 'Ref') {
    payload.refNo = this.refNo.split(',').map((value: string) => value.trim());
  } else {
    payload.awbNo = this.awbNo.split(',').map((value: string) => value.trim());
  }

  this.httpService.post(`${environment.apiUrl}Booking/getTrackingData`, payload).then(resp => {
    if (resp.status === 1) {
      console.log(this.PODimg , "podIMgggggggg");
      this.loadImage();

      if (resp.Data.length === 0) {
        this.openSnackBar("No data found. Please enter valid number(s).", 'error-snackbar');
        this.QuerryTableDataArray = [];
        this.showTable = false;
      } else {
        this.openSnackBar(resp.message, 'custom-snackbar');
        const uniqueDataArray = [];
        resp.Data.forEach(dataSet => {
          const existingDataSet = uniqueDataArray.find(data => data.QuerryTableData[0].awbNo === dataSet[0][0].awbNo);
          if (!existingDataSet) {
            uniqueDataArray.push({
              QuerryTableData: dataSet[0],
              QuerryTableData2: dataSet[1]
            });
          }
        });
        this.QuerryTableDataArray = uniqueDataArray;
        this.showTable = true;
      }
    } else {
      this.openSnackBar(resp.message, 'error-snackbar');
      this.QuerryTableDataArray = [];
      this.showTable = false;
    }
  }).catch((error: any) => {
    console.error('Error fetching data from API', error);
    this.QuerryTableDataArray = [];
    this.showTable = false;
  });
}

async loadImage() {
  try {
    this.PODimg = await this.httpService.convertImageToBase64(this.PODimg);
    console.log(this.PODimg, 'logoImage');
  } catch (error) {
    console.error('Error converting image:', error);
  }
}
    clearData() {
    this.awbNo = null;
    this.refNo = null;
    this.showTable = false;
    this.QuerryTableDataArray = [];
  }
openImage(base64Img: string) {
  const w = window.open();
  if (w) {
    w.document.write(`<img src="${base64Img}" style="width:100%"/>`);
  }
}

}
