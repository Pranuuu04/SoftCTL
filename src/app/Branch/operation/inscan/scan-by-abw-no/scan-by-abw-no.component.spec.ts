import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanByAbwNoComponent } from './scan-by-abw-no.component';

describe('ScanByAbwNoComponent', () => {
  let component: ScanByAbwNoComponent;
  let fixture: ComponentFixture<ScanByAbwNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanByAbwNoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanByAbwNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
