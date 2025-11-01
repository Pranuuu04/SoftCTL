import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from 'app/service/http.service';
import { SharedService } from 'app/service/shared.service';
import { environment } from 'environments/environment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-book-multiple-print',
  templateUrl: './book-multiple-print.component.html',
  styleUrls: ['./book-multiple-print.component.css']
})
export class BookMultiplePrintComponent implements OnInit {

  @ViewChild('container', { static: false }) container: ElementRef | undefined;
  @ViewChild('container1', { static: false }) container1: ElementRef;

  sessionLocationCode: string;
  ClientLogo: string;
  ClientName: string;
  awbNo: any;
  printType: any;

  pdfGenerated: boolean;
  docketData: any;
  barcode: string;
  logoImage: any;

  logoUrl: string;
  listData: any;
  containers: any;
  userType: string;
selectedValue: string;
  constructor(private _mdr: MatDialogRef<BookMultiplePrintComponent>,
              private httpService: HttpService,
              private sharedService: SharedService,
              private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) data: any, ) {
                if (data.awbNo || data.printType) {
                  this.awbNo = data.awbNo;
                  this.printType = data.printType;
                  console.log(this.awbNo);
                  console.log(this.printType);
                }
              }

  ngOnInit(): void {
//  this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
//     ? localStorage.getItem('originCode')
//     : localStorage.getItem('selectedValue');

    this.sessionLocationCode = localStorage.getItem('originCode');
    this.selectedValue = this.sharedService.getSelectedValue() || 'All';
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.userType = localStorage.getItem('userType');
    this.ClientName = localStorage.getItem('ClientName');
    this.loadImage();
    
    this.fetchData();
  }

  async loadImage() {
    try {
      this.logoImage = await this.httpService.convertImageToBase64(this.ClientLogo);
    } catch (error) {
      console.error('Error converting image:', error);
    }
  }

  CloseDialog() {
    this._mdr.close(false);
  }

  fetchData() {
    if (this.userType === 'Admin') {
      this.http.get<any>(`${environment.apiUrl}Booking/getDocketPrintData?sessionLocationCode=${this.selectedValue}&awbNo=${this.awbNo}&url=${environment.apiUrl}`)
      .subscribe(data => {
        // tslint:disable-next-line:one-line
        if (data.status === 1){
          this.docketData = data.Data[0];
          this.barcode = data.barcode;
          this.logoUrl = data.logoUrl;
          this.listData = data.Data[0][0];
          this.loadImage();
        } else {
          alert(data.message);
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
    } else {
      this.http.get<any>(`${environment.apiUrl}Booking/getDocketPrintData?sessionLocationCode=${this.sessionLocationCode}&awbNo=${this.awbNo}&url=${environment.apiUrl}`)
      .subscribe(data => {
        // tslint:disable-next-line:one-line
        if (data.status === 1){
          this.docketData = data.Data[0];
          this.barcode = data.barcode;
          this.logoUrl = data.logoUrl;
          this.listData = data.Data[0][0];
          this.loadImage();
        } else {
          alert(data.message);
        }
      }, error => {
        console.error('Error fetching data:', error);
      });
    }
  }
  // 1_2 print
printPDF() {
  const contentElements = document.querySelectorAll('#contentToConvert');

  if (contentElements.length > 0) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    let currentPage = 0;

    contentElements.forEach((contentElement, index) => {
      html2canvas(contentElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.7);
        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;

        const imgWidthMm = imgWidthPx * 0.264583;
        const imgHeightMm = imgHeightPx * 0.264583;

        const widthScaleFactor = pageWidth / imgWidthMm;
        const heightScaleFactor = pageHeight / imgHeightMm;

        const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

        const scaledImgWidth = imgWidthMm * scaleFactor;
        const scaledImgHeight = imgHeightMm * scaleFactor;

        const horizontalOffset = (pageWidth - scaledImgWidth) / 2;
        const verticalOffset = (pageHeight - scaledImgHeight) / 2;

        if (currentPage > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', horizontalOffset, verticalOffset, scaledImgWidth, scaledImgHeight);

        currentPage++;

        // If it's the last element, save or open the PDF
        if (index === contentElements.length - 1) {
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
        }
      });
    });
  } else {
    console.error('Content to convert not found');
  }
}
printPDF1_3() {
  const contentElements = document.querySelectorAll('#contentToConvert');

  if (contentElements.length > 0) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let currentPage = 0;

    contentElements.forEach((contentElement, index) => {
      html2canvas(contentElement as HTMLElement, {
        scale: 2, // Adjusted scale
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        const imgData = canvas.toDataURL('pdf/jpeg', 0.7); // Reduced quality
        const imgWidth = 210;
        const pageHeight = 297;

        let imgHeight = canvas.height * imgWidth / canvas.width;

        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
        }

        if (currentPage > 0) {
          pdf.addPage();
        }

        // Add the image to the PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        currentPage++;

        // If it's the last element, save or open the PDF
        if (index === contentElements.length - 1) {
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
        }
      });
    });
  } else {
    console.error('Content to convert not found');
  }
}


//   generatePDF1_2() {
//     const content = document.getElementById('contentToConvert');

//     if (!content) {
//         console.error('Element with id "contentToConvert" not found');
//         return;
//     }

//     html2canvas(content).then(canvas => {
//         const pdf = new jsPDF({
//             orientation: 'p',
//             unit: 'mm', // Use millimeters for precision
//             format: 'a4' // A4 size in mm (width, height)
//         });

//         const pageWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
//         const pageHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm

//         const imgData = canvas.toDataURL('image/png');

//         // Define target dimensions for each copy
//         const targetHeight = 145; // 14.5 cm in mm
//         const targetWidth = pageWidth; // Full width of A4 in mm

//         // Calculate the height of the image based on the full width
//         const imgWidth = canvas.width;
//         const imgHeight = canvas.height;
//         const aspectRatio = imgWidth / imgHeight;

//         // Scale the image to fit the target width
//         let scaledImgWidth = targetWidth;
//         let scaledImgHeight = targetWidth / aspectRatio;

//         // Adjust scaling to ensure the image fits within the target height
//         if (scaledImgHeight > targetHeight) {
//             const scaleFactor = targetHeight / scaledImgHeight;
//             scaledImgWidth *= scaleFactor;
//             scaledImgHeight *= scaleFactor;
//         }

//         // Add first image
//         pdf.addImage(imgData, 'PNG', 0, 0, scaledImgWidth, scaledImgHeight);

//         // Add second image, positioned below the first image
//         pdf.addImage(imgData, 'PNG', 0, scaledImgHeight, scaledImgWidth, scaledImgHeight);

//         pdf.save('download.pdf');
//         this.CloseDialog();
//     }).catch(error => {
//         console.error('Error generating PDF:', error);
//     });
// }

//   generatePDF1_3() {
//     const content = document.getElementById('contentToConvert');

//     if (!content) {
//         console.error('Element with id "contentToConvert" not found');
//         return;
//     }

//     html2canvas(content).then(canvas => {
//         const pdf = new jsPDF({
//             orientation: 'p',
//             unit: 'in',
//             format: 'a4'
//         });

//         const pixelToInch = 3 / 96; // Conversion factor from pixels to inches
//         const borderWidth = pixelToInch;
//         const pageWidth = pdf.internal.pageSize.getWidth(); // A4 width in inches
//         const pageHeight = pdf.internal.pageSize.getHeight(); // A4 height in inches

//         const imgData = canvas.toDataURL('image/png');
//         const imgWidth = pageWidth - 2 * borderWidth;
//         const imgHeight = (pageHeight / 3) - 2 * borderWidth;

//         // Positioning the first image
//         pdf.addImage(imgData, 'PNG', borderWidth, borderWidth, imgWidth, imgHeight, undefined, 'FAST');

//         // Positioning the second image
//         pdf.addImage(imgData, 'PNG', borderWidth, borderWidth + imgHeight + borderWidth, imgWidth, imgHeight, undefined, 'FAST');

//         // Positioning the third image
//         pdf.addImage(imgData, 'PNG', borderWidth, borderWidth + 2 * (imgHeight + borderWidth), imgWidth, imgHeight, undefined, 'FAST');

//         pdf.save('download.pdf');
//         this.CloseDialog();
//     }).catch(error => {
//         console.error('Error generating PDF:', error);
//     });
//   }


  // generatePDFLabel2() {
  //   this.ClientLogo =  localStorage.getItem('ClientLogo');
  //   console.log(this.ClientLogo,'ClientLogo');
  //   if (!this.container) {
  //     console.error('Data not fetched yet. Please wait for the data to be fetched.');
  //     return;
  //   }

  //   const element: HTMLElement = document.querySelector('container');
  //   const clientLogoImage = new Image();
  //   clientLogoImage.src = this.ClientLogo;
  //   console.log(clientLogoImage, 'imgData');

  //   clientLogoImage.onload = () => {
  //     html2canvas(this.container.nativeElement).then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       console.log(imgData, 'imgData');

  //       const pdf = new jsPDF({
  //         orientation: 'p',
  //         unit: 'mm',
  //         format: 'a4'
  //       });

  //     const imgWidth = 180;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     const scale = imgWidth / canvas.width;
  //     pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');
  //     const dottedLineY = imgHeight ;
  //     const lineWidth = 190;
  //     const lineHeight = 0.1;
  //     const pdfBlob = pdf.output('blob');
  //     const pdfUrl = URL.createObjectURL(pdfBlob);
  //     window.open(pdfUrl, '_blank');
  //   });
  // }
  // }

  generatePDFLabel2() {
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    console.log(this.ClientLogo, 'ClientLogo');
    if (!this.container) {
      console.error('Data not fetched yet. Please wait for the data to be fetched.');
      return;
    }

    const element: HTMLElement = document.querySelector('container');

    html2canvas(this.container.nativeElement, { width: 400, height: 400 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [400, 400] // Set PDF size to match canvas size
      });

      const imgWidth = 380; // Adjusted width
      const imgHeight = (canvas.height * imgWidth) / canvas.width - 10; // Adjusted height
      const scale = imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');
      const dottedLineY = imgHeight ;
      const lineWidth = 370; // Adjusted width to accommodate for 360px container
      const lineHeight = 0.1;

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    });
  }

  generatePDFLabel() {
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    console.log(this.ClientLogo, 'ClientLogo');
    if (!this.container) {
      console.error('Data not fetched yet. Please wait for the data to be fetched.');
      return;
    }

    const element: HTMLElement = document.querySelector('container');

    html2canvas(this.container.nativeElement, { width: 400, height: 400 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [400, 400]
      });

      const imgWidth = 350;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const offsetX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
      const offsetY = (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    });
  }

  async generatePDFLabel3() {
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    console.log(this.ClientLogo, 'ClientLogo');
    if (!this.container) {
      console.error('Data not fetched yet. Please wait for the data to be fetched.');
      return;
    }

    const element: HTMLElement = document.querySelector('container');

    html2canvas(this.container.nativeElement, { width: 400, height: 400 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [400, 400] // Set PDF size to match canvas size
      });

      const imgWidth = 380; // Adjusted width
      const imgHeight = (canvas.height * imgWidth) / canvas.width - 10; // Adjusted height
      const scale = imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');
      const dottedLineY = imgHeight ;
      const lineWidth = 370; // Adjusted width to accommodate for 360px container
      const lineHeight = 0.1;

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    });
  }



}
