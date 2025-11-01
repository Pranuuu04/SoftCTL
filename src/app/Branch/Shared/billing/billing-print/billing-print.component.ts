import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-billing-print',
  templateUrl: './billing-print.component.html',
  styleUrls: ['./billing-print.component.css']
})
export class BillingPrintComponent implements OnInit {

  constructor(private _mdr: MatDialogRef<BillingPrintComponent>, ) { }

  ngOnInit(): void {
  }
  CloseDialog() {
    this._mdr.close(true);
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

}
