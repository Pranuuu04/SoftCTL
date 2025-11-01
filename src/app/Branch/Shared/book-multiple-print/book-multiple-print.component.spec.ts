import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMultiplePrintComponent } from './book-multiple-print.component';

describe('BookMultiplePrintComponent', () => {
  let component: BookMultiplePrintComponent;
  let fixture: ComponentFixture<BookMultiplePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookMultiplePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookMultiplePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
