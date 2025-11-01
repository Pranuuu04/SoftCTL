import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDrsComponent } from './delete-drs.component';

describe('DeleteDrsComponent', () => {
  let component: DeleteDrsComponent;
  let fixture: ComponentFixture<DeleteDrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDrsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
