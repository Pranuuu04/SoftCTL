import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoCourierComponent } from './co-courier.component';

describe('CoCourierComponent', () => {
  let component: CoCourierComponent;
  let fixture: ComponentFixture<CoCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoCourierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
