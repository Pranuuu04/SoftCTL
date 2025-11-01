import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDescriptionComponent } from './invoice-description.component';

describe('InvoiceDescriptionComponent', () => {
  let component: InvoiceDescriptionComponent;
  let fixture: ComponentFixture<InvoiceDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
