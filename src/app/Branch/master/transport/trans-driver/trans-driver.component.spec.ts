import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransDriverComponent } from './trans-driver.component';

describe('TransDriverComponent', () => {
  let component: TransDriverComponent;
  let fixture: ComponentFixture<TransDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
