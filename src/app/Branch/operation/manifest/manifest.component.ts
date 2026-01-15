import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PendingManifestComponent } from './pending-manifest/pending-manifest.component';
import { CreateManifestComponent } from './create-manifest/create-manifest.component';
import { ViewManifestComponent } from './view-manifest/view-manifest.component';


@Component({
  selector: 'app-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.css']
})
export class ManifestComponent implements OnInit {
 
  @ViewChild(PendingManifestComponent) private pending: PendingManifestComponent;
  @ViewChild(CreateManifestComponent) private Create: CreateManifestComponent;
  @ViewChild(ViewManifestComponent) private view: ViewManifestComponent;
 
  constructor() { }

  ngOnInit(): void {
  }
  
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.pending.refresh(); 
        break;
      case 1:
        this.Create.refresh(); 
        break;
      case 2:
        this.view.refresh(); 
        break;
    }
  }
}
