import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit {

  imageBase64: any;

  constructor(private _mdr: MatDialogRef<ImageViewComponent>,
                  @Inject(MAT_DIALOG_DATA) public data: any) {

                    this.imageBase64 = this.data?.imageData;
                   }

  ngOnInit(): void {


  }

  CloseDialog() {
    this._mdr.close(false);
  }

  getBase64Image(): string {
    // return  'data:image/png;base64,' + this.imageBase64;
    return   this.imageBase64;
  }

    downloadImage(){
      const imageUrl =  this.imageBase64; 
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'downloaded-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

}
