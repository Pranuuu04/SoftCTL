import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManferrorLogComponent } from './manferror-log.component';

describe('ManferrorLogComponent', () => {
  let component: ManferrorLogComponent;
  let fixture: ComponentFixture<ManferrorLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManferrorLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManferrorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
