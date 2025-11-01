import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportWayComponent } from './transport-way.component';

describe('TransportWayComponent', () => {
  let component: TransportWayComponent;
  let fixture: ComponentFixture<TransportWayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportWayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
