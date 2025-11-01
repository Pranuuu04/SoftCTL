import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  fileName: string = '';
  progress: number = 0;
  currentItem: string = '';
  private cancelUpload$ = new Subject<void>();

  constructor(private _mdr: MatDialogRef<ProgressBarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { action: string, fileName: string }
              ){
              this.fileName = data.fileName;
              }
              
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
  }

  cancelUpload() {
    this.cancelUpload$.next();
    this._mdr.close(false);
  }

  getCancelSignal() {
    return this.cancelUpload$.asObservable();
  }
}
