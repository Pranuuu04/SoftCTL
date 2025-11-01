import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-undeliverd-pod',
  templateUrl: './undeliverd-pod.component.html',
  styleUrls: ['./undeliverd-pod.component.css']
})
export class UndeliverdPodComponent implements OnInit {
 selectedStatus = 'UnDelivered';
  validationMessage: any = [];
  sessionLocationCode: any;
  awbNo: any;
  itemData: any;
  undeliverdform: any;
  reasonList: any;
  userType: any;
  selectedValue: any;
  destinationName: any;
  cardImageBase64: any;
  imageError: string;
  isImageSaved: boolean;
  buttonDisabled = true;


  constructor(public dialog: MatDialog,
              private router: Router,
              public httpService: HttpService,
              public formbuilder: FormBuilder, ) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.destinationName = localStorage.getItem('selectedValue');
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.renderForm();
    this.getReasonList();
  }

  renderForm() {
    this.validationMessage = {
      awb: [
        {type: 'required', message : 'please Enter Awb No'}
      ],
      status: [
        {type: 'required', message : 'please select status'}
      ],
      date: [
        {type: 'required', message : 'please select date'}
      ],
      time: [
        {type: 'required', message: 'please enter time'}
      ],
      reason: [
        {type: 'required', message: 'please enter reason'}
      ],
      remark: [
        {type: 'required', message: ''}
      ]
    }
    this.undeliverdform = this.formbuilder.group({
      awb: new FormControl('', Validators.compose([
        Validators.required
      ])),
      status: new FormControl('', Validators.compose([
        Validators.required
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      time: new FormControl('', Validators.compose([
        Validators.required
      ])),
      reason: new FormControl('', Validators.compose([
        Validators.required
      ])),
      remark: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }

  getDeleiveredData() {
   if (this.userType !== 'Admin') {
    // tslint:disable-next-line:max-line-length
    this.httpService.get(`${environment.apiUrl}pod/getPodUpdateData?SessionLocationCode=` + this.sessionLocationCode + '&awbNo=' + this.awbNo).then(resp => {
      console.log(resp, 'hello pod data');
      if (resp.status === 1) {
        this.itemData = resp.Data[0];
        this.buttonDisabled = false;
      } else {
        alert(resp.message);
      }
    })
   } else {
    // tslint:disable-next-line:max-line-length
    this.httpService.get(`${environment.apiUrl}pod/getPodUpdateData?SessionLocationCode=` + this.destinationName + '&awbNo=' + this.awbNo).then(resp => {
      console.log(resp, 'hello pod data');
      if (resp.status === 1) {
        this.itemData = resp.Data[0];
        this.buttonDisabled = false;
      } else {
        alert(resp.message);
      }
    })
   }
  }

  getReasonList() {
    this.httpService.get(`${environment.apiUrl}pod/getReason`).then(resp => {
      console.log(resp);
      this.reasonList = resp.Data;
    })
  }

  formSubmit(formData: any) {
    if (this.undeliverdform.valid) {
      const obj = {
        sessionLocationCode: this.destinationName || this.sessionLocationCode ,
        awbNo: formData.awb,
        delDate: formData.date,
        delTime: formData.time,
        status: formData.status,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        Remark: formData.remark,
        totalAmt: '',
        podImg: this.cardImageBase64
      }

      console.log(obj, 'xyz');
      this.httpService.post(`${environment.apiUrl}pod/savePodData`, obj).then(resp => {
        console.log(resp, 'pod data');
        // alert(resp.message);
        if (resp.status === 1) {
          alert(resp.message);
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([this.router.url]);
          this.undeliverdform.reset();
          this.itemData = '';
        } else {
          alert(resp.message);
        }
      })
    } else {
      Object.keys(this.undeliverdform.controls).forEach((filed) => {
        const control =  this.undeliverdform.get(filed);
        control.markAsTouched({onlySelf: true});
      });
    }
 }

 fileChangeEvent(fileInput: any) {
  this.imageError = null;
  if (fileInput.target.files && fileInput.target.files[0]) {
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
      const max_height = 15200;
      const max_width = 25600;
      if (fileInput.target.files[0].size > max_size) {
          this.imageError =
              'Maximum size allowed is ' + max_size / 1000 + 'Mb';
          return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
              const img_height = rs.currentTarget['height'];
              const img_width = rs.currentTarget['width'];
              console.log(img_height, img_width);
              if (img_height > max_height && img_width > max_width) {
                  this.imageError =
                      'Maximum dimentions allowed ' +
                      max_height +
                      '*' +
                      max_width +
                      'px';
                  return false;
              } else {
                  const imgBase64Path = e.target.result;
                  this.cardImageBase64 = imgBase64Path;
                  this.isImageSaved = true;
                  console.log(this.cardImageBase64);
                  this.undeliverdform.get('image').setValue('');
                  this.cardImageBase64 = '';
                  this.isImageSaved = false;
              }
          };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
  }
}
}
