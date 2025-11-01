import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgressBarComponent } from 'app/Comman/progress-bar/progress-bar.component';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-docket-multiple',
  templateUrl: './docket-multiple.component.html',
  styleUrls: ['./docket-multiple.component.css']
})
export class DocketMultipleComponent implements OnInit {

  @ViewChildren('container') containers: QueryList<ElementRef>;
  @ViewChildren('container1') container1: QueryList<ElementRef>;
  @ViewChild('container', { static: false }) container: ElementRef | undefined;
  @ViewChild('container2', { static: false }) container2: ElementRef;

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
  listData: any[] = [];
  length: any;

  constructor(private _mdr: MatDialogRef<DocketMultipleComponent>,
              private httpService: HttpService,
              private http: HttpClient,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: any, ) {
                if (data.pageData || data.printType) {
                  this.listData = data.pageData;
                  this.printType = data.printType;
                  this.barcode = data.barcode;
                  console.log(this.listData, 'listData');
                  console.log(this.barcode, 'barcode');
                  console.log(this.printType, 'printType');
                  this.length = this.listData.length;
                }
                this.sessionLocationCode = localStorage.getItem('originCode');
                this.ClientLogo =  localStorage.getItem('ClientLogo');
              }

  ngOnInit(): void {
    this.sessionLocationCode = localStorage.getItem('originCode');
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    this.ClientName = localStorage.getItem('ClientName');
    this.loadImage();
  }

  Excelprogressbar(): MatDialogRef<ProgressBarComponent> {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      data: {
        action: 'docketPrint',
      },
      width: '20rem',
      disableClose: true
    });
    return dialogRef;
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

  async generatePDFlabel1() {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'in',
      format: [4, 5] // Page size of 4x5 inches
    });

    const pixelToInch = 3 / 96; // 1 inch = 96 pixels
    const borderWidth = pixelToInch;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 2 * borderWidth;
    const imgHeight = pageHeight - 2 * borderWidth - 0.2; // Reduce image height slightly more to ensure bottom border is visible
    const offsetX = borderWidth;
    const offsetY = borderWidth * 0.5; // Reduce vertical offset to move the image closer to the top

    const containerElements = this.containers.toArray();

    for (let i = 0; i < containerElements.length; i++) {
      const container = containerElements[i];
      const canvas = await html2canvas(container.nativeElement);
      const imgData = canvas.toDataURL('image/png');

      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');
    }

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
  openprogressbar(): MatDialogRef<ProgressBarComponent> {
  const dialogRef = this.dialog.open(ProgressBarComponent, {
    data: { action: 'docketPrint' },
    width: '20rem',
    disableClose: true
  });
  return dialogRef;
}
  printPDF() {
    const contentElements = document.querySelectorAll('#contentToConvert');

    if (contentElements.length > 0) {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      let currentPage = 0;

      contentElements.forEach((contentElement, index) => {
        html2canvas(contentElement as HTMLElement, {
          scale: 2, // Adjust scale for better quality
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
          const verticalOffset = 0;

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
  // printPDF1_3() {
  //   const contentElements = document.querySelectorAll('#contentToConvert');

  //   if (contentElements.length > 0) {
  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     let currentPage = 0;

  //     contentElements.forEach((contentElement, index) => {
  //       html2canvas(contentElement as HTMLElement, {
  //         scale: 2, // Adjusted scale
  //         useCORS: true,
  //         allowTaint: true,
  //       }).then(canvas => {
  //         const imgData = canvas.toDataURL('pdf/jpeg', 0.7); // Reduced quality
  //         const imgWidth = 210;
  //         const pageHeight = 297;

  //         let imgHeight = canvas.height * imgWidth / canvas.width;

  //         if (imgHeight > pageHeight) {
  //           imgHeight = pageHeight;
  //         }

  //         if (currentPage > 0) {
  //           pdf.addPage();
  //         }

  //         // Add the image to the PDF
  //         pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

  //         currentPage++;

  //         // If it's the last element, save or open the PDF
  //         if (index === contentElements.length - 1) {
  //           const pdfBlob = pdf.output('blob');
  //           const pdfUrl = URL.createObjectURL(pdfBlob);
  //           window.open(pdfUrl, '_blank');
  //         }
  //       });
  //     });
  //   } else {
  //     console.error('Content to convert not found');
  //   }
  // }

//   generatePDF1_2() {
//     const contentElements = document.querySelectorAll('[id^="contentToConvert"]');

//     if (contentElements.length === 0) {
//         console.error('Elements with id "contentToConvert" not found');
//         return;
//     }

//     const pdf = new jsPDF({
//         orientation: 'p',
//         unit: 'mm',
//         format: 'a4'
//     });

//     const pageWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
//     const maxPageHeight = pdf.internal.pageSize.getHeight(); // Define a maximum height in mm less than full A4 height
//     const leftMargin = 2; // Margin in mm
//     const rightMargin = 2; // Margin in mm
//     const topMargin = 2; // Top margin in mm
//     const contentWidth = pageWidth - leftMargin - rightMargin;
//     const contentHeight = maxPageHeight - topMargin;

//     let currentPageIndex = 0;

//     const processNext = () => {
//         if (currentPageIndex >= contentElements.length) {
//             pdf.save('download.pdf');
//             return;
//         }

//         const contentElement = contentElements[currentPageIndex] as HTMLElement;
//         html2canvas(contentElement).then(canvas => {
//             const imgData = canvas.toDataURL('image/png');
//             const imgWidth = canvas.width;
//             const imgHeight = canvas.height;
//             const aspectRatio = imgWidth / imgHeight;

//             // Scale the image to fit the content width with margins
//             const scaledImgWidth = contentWidth;
//             const scaledImgHeight = contentHeight;

//             // Adjust scaling to ensure the image fits within the max height
//             if (scaledImgHeight > contentHeight) {
//                 const scaleFactor = contentHeight / scaledImgHeight;
//                 pdf.addImage(imgData, 'PNG', leftMargin, topMargin, scaledImgWidth * scaleFactor, scaledImgHeight * scaleFactor);
//             } else {
//                 // If height is within the limit, use the calculated dimensions
//                 pdf.addImage(imgData, 'PNG', leftMargin, topMargin, scaledImgWidth, scaledImgHeight);
//             }

//             currentPageIndex++;
//             if (currentPageIndex < contentElements.length) {
//                 pdf.addPage();
//             }
//             processNext();
//         }).catch(error => {
//             console.error('Error generating PDF:', error);
//         });
//     };

//     processNext();
// }

//  generatePDF1_3() {
//   this.ClientLogo =  localStorage.getItem('ClientLogo');
//   console.log(this.ClientLogo, 'ClientLogo');
//   const contentElements = document.querySelectorAll('[id^="contentToConvert"]');

//   if (contentElements.length === 0) {
//       console.error('Elements with id "contentToConvert" not found');
//       return;
//   }
//   const progressBarRef = this.Excelprogressbar();

//   const pdf = new jsPDF({
//       orientation: 'p',
//       unit: 'mm',
//       format: 'a4'
//   });

//   const pageWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
//   const maxPageHeight = 287; // Define a maximum height in mm less than full A4 height
//   const leftMargin = 5; // Margin in mm
//   const rightMargin = 5; // Margin in mm
//   const topMargin = 5; // Top margin in mm
//   const contentWidth = pageWidth - leftMargin - rightMargin;
//   const contentHeight = maxPageHeight - topMargin;

//   let currentPageIndex = 0;

//   const processNext = () => {
//       if (currentPageIndex >= contentElements.length) {
//           pdf.save('download.pdf');
//           return;
//       }

//       const contentElement = contentElements[currentPageIndex] as HTMLElement;
//       html2canvas(contentElement).then(canvas => {
//           const imgData = canvas.toDataURL('image/png');
//           const imgWidth = canvas.width;
//           const imgHeight = canvas.height;
//           const aspectRatio = imgWidth / imgHeight;
//           const scaledImgWidth = contentWidth;
//           const scaledImgHeight = contentHeight ;

//           if (scaledImgHeight > contentHeight) {
//               const scaleFactor = contentHeight / scaledImgHeight;
//               pdf.addImage(imgData, 'PNG', leftMargin, topMargin, scaledImgWidth * scaleFactor, scaledImgHeight * scaleFactor);
//           } else {
//               pdf.addImage(imgData, 'PNG', leftMargin, topMargin, scaledImgWidth, scaledImgHeight);
//           }

//           currentPageIndex++;
//           if (currentPageIndex < contentElements.length) {
//               pdf.addPage();
//           }
//           processNext();
//           progressBarRef.close();
//       }).catch(error => {
//           console.error('Error generating PDF:', error);
//       });
//   };

//   processNext();
//  }

  async generatePDFlabel2() {
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    console.log(this.ClientLogo, 'ClientLogo');
    if (!this.container) {
      console.error('Data not fetched yet. Please wait for the data to be fetched.');
      return;
    }
    const element: HTMLElement = document.querySelector('container');
    html2canvas(this.container.nativeElement, { width: 400, height: 400 }).then(async (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [400, 400]
      });

      const pixelToInch = 3 / 96;
      const borderWidth = pixelToInch;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 2 * borderWidth;
      const imgHeight = pageHeight - 2 * borderWidth - 0.2;
      const offsetX = borderWidth;
      const offsetY = borderWidth * 0.5;


      const containerElements = this.containers.toArray();

      for (let i = 0; i < containerElements.length; i++) {
        const container = containerElements[i];
        // tslint:disable-next-line:no-shadowed-variable
        const canvas = await html2canvas(container.nativeElement);
        // tslint:disable-next-line:no-shadowed-variable
        const imgData = canvas.toDataURL('image/png');

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');
      }

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    });
  }

  generatePDFlabel3() {
    this.ClientLogo =  localStorage.getItem('ClientLogo');
    console.log(this.ClientLogo, 'ClientLogo');
    if (!this.container) {
      console.error('Data not fetched yet. Please wait for the data to be fetched.');
      return;
    }

    const element: HTMLElement = document.querySelector('container');

    html2canvas(this.container.nativeElement, { width: 400, height: 400 }).then(async (canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [400, 400] // Set PDF size to match canvas size
      });

      const pixelToInch = 3 / 96; // 1 inch = 96 pixels
      const borderWidth = pixelToInch;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 2 * borderWidth;
      const imgHeight = pageHeight - 2 * borderWidth - 0.2; // Reduce image height slightly more to ensure bottom border is visible
      const offsetX = borderWidth;
      const offsetY = borderWidth * 0.5; // Reduce vertical offset to move the image closer to the top


      const containerElements = this.containers.toArray();

      for (let i = 0; i < containerElements.length; i++) {
        const container = containerElements[i];
        // tslint:disable-next-line:no-shadowed-variable
        const canvas = await html2canvas(container.nativeElement);
        // tslint:disable-next-line:no-shadowed-variable
        const imgData = canvas.toDataURL('image/png');

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight, undefined, 'FAST');
      }

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
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

}


