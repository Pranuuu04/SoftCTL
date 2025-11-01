import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransRouteComponent } from './trans-route.component';

describe('TransRouteComponent', () => {
  let component: TransRouteComponent;
  let fixture: ComponentFixture<TransRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
