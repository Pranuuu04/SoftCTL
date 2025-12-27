import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AirwaybillComponent } from 'app/Branch/Shared/POD pages/airwaybill/airwaybill.component';
import { HttpService } from 'app/service/http.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-deliverd',
  templateUrl: './deliverd.component.html',
  styleUrls: ['./deliverd.component.css']
})
export class DeliverdComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  selectedStatus: string = 'Delivered';
  validationMessage: any = [];
  deliverdform: any;
  sessionLocationCode: any;
  awbNo: any;
  itemData: any;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  userType: any;
  selectedValue: any;
  destinationName: any;
  currentDate: string;
  buttonDisabled: boolean = true;  
    selectedFile!: File;
  username: string;
 
  constructor(public dialog: MatDialog,
              private router: Router,
              private sharedService: SharedService,
              public httpService: HttpService,
              public formbuilder: FormBuilder,
            public http: HttpClient) { }

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.username = localStorage.getItem('userName');
    this.currentDate = new Date().toISOString().split('T')[0];
    this.destinationName = this.sharedService.getSelectedValue();
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.renderForm();
  }

  renderForm() {
    this.validationMessage = {
      awb: [
        {type: 'required' , message: 'enter your awb no'}
      ],
      status: [
        {type: 'required', message: 'please select status'}
      ],
      date: [
        {type: 'required', message: 'please select date'}
      ],
      time: [
        {type: 'required', message: 'please enter time'}
      ],
      recipt: [
        {type: 'required', message: 'please enter recipt'}
      ],
      receiver: [
        {type: 'required', message: 'please select receiver'}
      ],
      contact: [
        {type: 'required', message: 'please enter contact no'}
      ],
       remark: [
        {type: 'required', message: 'please enter remark'}
      ],
      // image: [
      //   {type: 'required', message: 'please select image'}
      // ],
    }
    this.deliverdform = this.formbuilder.group({
      awb: new FormControl('', Validators.compose([
        Validators.required
      ])),
      status: new FormControl('Delivered', Validators.compose([
        Validators.required
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required
      ])),
      time: new FormControl('', Validators.compose([
      ])),
      recipt: new FormControl('', Validators.compose([
      ])),
      receiver: new FormControl('', Validators.compose([
      ])),
      contact: new FormControl('', Validators.compose([
        // Validators.required
      ])),
      remark: new FormControl('', Validators.compose([
      ])),
      deliveryProof: new FormControl('', Validators.compose([
      ])),
      // image: new FormControl('', Validators.compose([
      // ])),
    })
  }
fromSubmit(formData: any) {
  if (this.deliverdform.invalid) {
    Object.keys(this.deliverdform.controls).forEach(field => {
      this.deliverdform.get(field)?.markAsTouched();
    });
    return;
  }

  const fd = new FormData();

  fd.append('SessionLocationCode', this.destinationName || this.sessionLocationCode);
  fd.append('status', formData.status);
  fd.append('awbNo', formData.awb || this.awbNo);
  fd.append('recvName', formData.receiver);
  fd.append('recvNumber', formData.contact);
  fd.append('reason', '');
  fd.append('userName', this.username);
  fd.append('Remark', formData.remark);
  fd.append('totalAmt', '');
  fd.append('delDate', formData.date);
  fd.append('delTime', formData.time);
  fd.append('deliveryProof', formData.deliveryProof);
  fd.append('baseUrl', environment.apiUrl);

  // 👇 FILE (VERY IMPORTANT)
  if (this.selectedFile) {
    fd.append('podimage', this.selectedFile);
  }

  this.http.post(
    `${environment.apiUrl}pod/savePodData`,
    fd
  ).subscribe({
    next: (resp: any) => {
      if (resp.status === 1) {
        alert(resp.message);
        this.resetForm();
      } else {
        alert(resp.message);
      }
    },
    error: () => alert('Upload failed')
  });
}
resetForm() {
  this.deliverdform.reset();

  this.awbNo = '';
  this.itemData = '';
  this.cardImageBase64 = '';
  this.selectedFile = null as any;

  this.isImageSaved = false;
  this.buttonDisabled = false;

  // If you reload same route after success
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([this.router.url]);
}

fileChangeEvent(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const maxSize = 20 * 1024 * 1024;
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

  if (file.size > maxSize) {
    this.imageError = 'Max file size is 20MB';
    return;
  }

  if (!allowedTypes.includes(file.type)) {
    this.imageError = 'Only JPG, PNG, PDF allowed';
    return;
  }

  this.selectedFile = file;
  this.imageError = null;
}

//   fromSubmit(formData: any) {
//     if (this.deliverdform.valid) {
//       const obj = {
//         sessionLocationCode: this.destinationName || this.sessionLocationCode ,
//         awbNo: formData.awb || this.awbNo,
//         delDate: formData.date,
//         delTime: formData.time,
//         status: formData.status,
//         recvName: formData.receiver,
//         recvNumber: formData.contact,
//         deliveryProof: formData.deliveryProof,
//         Remark: formData.remark,
//         reason: '',
//         totalAmt: '',
//         podImg: this.cardImageBase64
//       }
//       if (this.userType !== 'Admin') {
//         this.httpService.post(`${environment.apiUrl}pod/savePodData`, obj).then(resp => {
//           console.log(resp, 'pod data');
//           if (resp.status === 1) {
//             alert(resp.message);
//             this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//             this.router.onSameUrlNavigation = 'reload';
//             this.router.navigate([this.router.url]);
//             this.deliverdform.reset();
//             this.itemData = '';
//             this.cardImageBase64 = '';
//             this.deliverdform.image = '';
//             this.isImageSaved = false;
//           } else {
//             alert(resp.message);
//           }
//         })
//       } else {
//         this.httpService.post(`${environment.apiUrl}pod/savePodData`, obj).then(resp => {
//           console.log(resp, 'pod data');
//           if (resp.status === 1) {
//             alert(resp.message);
//             this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//             this.router.onSameUrlNavigation = 'reload';
//             this.router.navigate([this.router.url]);
//             this.deliverdform.reset();
//             this.itemData = '';
//             this.cardImageBase64 = '';
//             this.deliverdform.image = '';
//             this.isImageSaved = false;

//           } else {
//             alert(resp.message);
//           }
//         })
//       }
//     } else {
//       Object.keys(this.deliverdform.controls).forEach((filed) => {
//         const control =  this.deliverdform.get(filed);
//         control.markAsTouched({onlySelf: true});
//       });
//     }
//  }

  getDeleiveredData() {
   if (this.userType !== 'Admin') {
    // tslint:disable-next-line:max-line-length
    this.httpService.get(`${environment.apiUrl}pod/getPodData?SessionLocationCode=` + this.sessionLocationCode + '&awbNo=' + this.awbNo).then(resp => {
      console.log(resp, 'hello pod data');
      if (resp.status === 1) {
        this.itemData = resp.Data[0];
        this.buttonDisabled = false;
      } else {
        alert(resp.message);
        this.buttonDisabled = true;
      }
    })
   } else {
    // tslint:disable-next-line:max-line-length
    this.httpService.get(`${environment.apiUrl}pod/getPodData?SessionLocationCode=` + this.destinationName + '&awbNo=' + this.awbNo).then(resp => {
      console.log(resp, 'hello pod data');
      if (resp.status === 1) {
        this.itemData = resp.Data[0];
        this.buttonDisabled = false;
      } else {
        alert(resp.message);
        this.buttonDisabled = true;
      }
    })
   }
  }

//   fileChangeEvent(fileInput: any) {
//     this.imageError = null;
//     if (fileInput.target.files && fileInput.target.files[0]) {
//         const max_size = 20971520;
//         const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
//         const max_height = 15200;
//         const max_width = 25600;
//         if (fileInput.target.files[0].size > max_size) {
//             this.imageError =
//                 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
//             return false;
//         }
//         const reader = new FileReader();
//         reader.onload = (e: any) => {
//             const image = new Image();
//             image.src = e.target.result;
//             image.onload = rs => {
//                 const img_height = rs.currentTarget['height'];
//                 const img_width = rs.currentTarget['width'];
//                 console.log(img_height, img_width);
//                 if (img_height > max_height && img_width > max_width) {
//                     this.imageError =
//                         'Maximum dimentions allowed ' +
//                         max_height +
//                         '*' +
//                         max_width +
//                         'px';
//                     return false;
//                 } else {
//                     const imgBase64Path = e.target.result;
//                     this.cardImageBase64 = imgBase64Path;
//                     this.isImageSaved = true;
//                     this.deliverdform.get('image').setValue('');
//                     console.log(this.cardImageBase64);
//                     this.cardImageBase64 = '';
//                     this.isImageSaved = false;
//                 }
//             };
//         };
//         reader.readAsDataURL(fileInput.target.files[0]);
//     }
// }

}
