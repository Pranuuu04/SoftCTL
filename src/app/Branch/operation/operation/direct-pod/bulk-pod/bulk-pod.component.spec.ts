import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPodComponent } from './bulk-pod.component';

describe('BulkPodComponent', () => {
  let component: BulkPodComponent;
  let fixture: ComponentFixture<BulkPodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
