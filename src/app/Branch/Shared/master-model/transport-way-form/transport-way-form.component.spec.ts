import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportWayFormComponent } from './transport-way-form.component';

describe('TransportWayFormComponent', () => {
  let component: TransportWayFormComponent;
  let fixture: ComponentFixture<TransportWayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportWayFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportWayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
