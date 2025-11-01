import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ScanByAbwNoComponent } from './scan-by-abw-no/scan-by-abw-no.component';
import { ScanByManifestComponent } from './scan-by-manifest/scan-by-manifest.component';

@Component({
  selector: 'app-inscan',
  templateUrl: './inscan.component.html',
  styleUrls: ['./inscan.component.css']
})
export class InscanComponent implements OnInit {

  @ViewChild(ScanByAbwNoComponent) private ScanAwb: ScanByAbwNoComponent;
  @ViewChild(ScanByManifestComponent) private ScanManf: ScanByManifestComponent;
  dispatch: string;

  constructor() {
    this.dispatch = localStorage.getItem('dispatch');
   }

  ngOnInit(): void {
  }

  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.ScanAwb.refresh();
        break;
      case 1:
        this.ScanManf.refresh();
        break;
    }
  }
}
