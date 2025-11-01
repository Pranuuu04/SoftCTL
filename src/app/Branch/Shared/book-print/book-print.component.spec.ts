import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPrintComponent } from './book-print.component';

describe('BookPrintComponent', () => {
  let component: BookPrintComponent;
  let fixture: ComponentFixture<BookPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
