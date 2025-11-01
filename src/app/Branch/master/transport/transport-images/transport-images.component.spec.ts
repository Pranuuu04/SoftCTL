import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportImagesComponent } from './transport-images.component';

describe('TransportImagesComponent', () => {
  let component: TransportImagesComponent;
  let fixture: ComponentFixture<TransportImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
